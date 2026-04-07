(function () {
    async function uploadInChunks(form) {
        const fileInput = form.querySelector('input[name="file"]');
        const status = form.querySelector("[data-chunk-upload-status]");
        const submitButton = form.querySelector('button[type="submit"]');
        const file = fileInput?.files?.[0];

        if (!file) {
            form.submit();
            return;
        }

        const chunkSize = Number(form.dataset.chunkSize || 1048576);
        const totalChunks = Math.max(1, Math.ceil(file.size / chunkSize));
        const uploadId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
        const csrfToken =
            form.querySelector('input[name="_token"]')?.value || "";
        const formAction = form.getAttribute("action") || window.location.href;
        const originalButtonHtml = submitButton?.innerHTML;

        if (submitButton) {
            submitButton.disabled = true;
        }

        if (status) {
            status.classList.remove("d-none");
        }

        try {
            for (let index = 0; index < totalChunks; index++) {
                const start = index * chunkSize;
                const end = Math.min(start + chunkSize, file.size);
                const chunk = file.slice(start, end);
                const payload = new FormData();
                const methodOverride = form.querySelector(
                    'input[name="_method"]',
                )?.value;

                payload.append("_token", csrfToken);
                if (methodOverride) {
                    payload.append("_method", methodOverride);
                }
                payload.append("is_chunked_upload", "1");
                payload.append("upload_id", uploadId);
                payload.append("chunk_index", String(index));
                payload.append("total_chunks", String(totalChunks));
                payload.append("original_name", file.name);
                payload.append(
                    "title",
                    form.querySelector('[name="title"]')?.value || "",
                );
                payload.append(
                    "description",
                    form.querySelector('[name="description"]')?.value || "",
                );
                payload.append(
                    "class_id",
                    form.querySelector('[name="class_id"]')?.value || "",
                );

                form.querySelectorAll(
                    'input[name="stream_ids[]"]:checked',
                ).forEach((input) => {
                    payload.append("stream_ids[]", input.value);
                });

                payload.append("file", chunk, file.name);

                if (status) {
                    status.textContent = `Uploading ${index + 1} of ${totalChunks}...`;
                }

                const response = await fetch(formAction, {
                    method: "POST",
                    body: payload,
                    headers: {
                        "X-Requested-With": "XMLHttpRequest",
                        Accept: "application/json",
                    },
                    credentials: "same-origin",
                });

                const data = await response.json().catch(() => ({}));

                if (!response.ok) {
                    throw new Error(data.message || "Upload failed.");
                }

                if (data.status === "completed") {
                    if (status) {
                        status.textContent =
                            data.message || "Upload completed.";
                    }
                    window.location.href =
                        data.redirect_url || window.location.href;
                    return;
                }
            }
        } catch (error) {
            if (status) {
                status.textContent = error.message || "Upload failed.";
            }

            if (window.Swal) {
                window.Swal.fire({
                    icon: "error",
                    title: "Upload failed",
                    text:
                        error.message ||
                        "The file could not be uploaded right now.",
                    confirmButtonText: "OK",
                });
            }
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                if (originalButtonHtml) {
                    submitButton.innerHTML = originalButtonHtml;
                }
            }
        }
    }

    function initStreamDropdown(modalElement) {
        const classSelect = modalElement.querySelector(
            'select[name="class_id"]',
        );
        const streamDropdown = modalElement.querySelector(
            "[data-stream-dropdown]",
        );
        const streamTrigger = streamDropdown?.querySelector(
            "[data-stream-trigger]",
        );
        const streamLabel = streamDropdown?.querySelector(
            "[data-stream-label]",
        );
        const allStreamsCheckbox = streamDropdown?.querySelector(
            "[data-stream-all-option] input",
        );

        if (
            !classSelect ||
            !streamDropdown ||
            !streamTrigger ||
            !streamLabel ||
            !allStreamsCheckbox
        ) {
            return;
        }

        function streamCheckboxes() {
            return Array.from(
                streamDropdown.querySelectorAll(
                    '[data-stream-option] input[name="stream_ids[]"]',
                ),
            );
        }

        function visibleStreamCheckboxes() {
            return streamCheckboxes().filter(
                (checkbox) =>
                    checkbox.closest("[data-stream-option]")?.style.display !==
                    "none",
            );
        }

        function updateStreamLabel() {
            const selected = visibleStreamCheckboxes().filter(
                (checkbox) => checkbox.checked,
            );

            if (allStreamsCheckbox.checked || selected.length === 0) {
                streamLabel.textContent = "All streams";
                return;
            }

            if (selected.length === 1) {
                streamLabel.textContent =
                    selected[0].closest("label")?.querySelector("span")
                        ?.textContent || "1 stream selected";
                return;
            }

            streamLabel.textContent = `${selected.length} streams selected`;
        }

        function filterStreams() {
            const selectedClass = classSelect.value;

            streamCheckboxes().forEach((checkbox) => {
                const option = checkbox.closest("[data-stream-option]");
                const optionClass = option?.getAttribute("data-class-id");
                const visible =
                    selectedClass === "" || optionClass === selectedClass;

                if (option) {
                    option.style.display = visible ? "" : "none";
                }

                if (!visible) {
                    checkbox.checked = false;
                }
            });

            if (
                !visibleStreamCheckboxes().some((checkbox) => checkbox.checked)
            ) {
                allStreamsCheckbox.checked = true;
            }

            updateStreamLabel();
        }

        streamTrigger.addEventListener("click", function () {
            const isOpen = streamDropdown.classList.toggle("is-open");
            streamTrigger.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false",
            );
        });

        allStreamsCheckbox.addEventListener("change", function () {
            if (allStreamsCheckbox.checked) {
                streamCheckboxes().forEach((checkbox) => {
                    checkbox.checked = false;
                });
            }

            updateStreamLabel();
        });

        streamCheckboxes().forEach((checkbox) => {
            checkbox.addEventListener("change", function () {
                if (checkbox.checked) {
                    allStreamsCheckbox.checked = false;
                }

                if (
                    !streamCheckboxes().some(
                        (item) =>
                            item.checked &&
                            item.closest("[data-stream-option]")?.style
                                .display !== "none",
                    )
                ) {
                    allStreamsCheckbox.checked = true;
                }

                updateStreamLabel();
            });
        });

        classSelect.addEventListener("change", filterStreams);
        modalElement.addEventListener("show.bs.modal", filterStreams);
        modalElement.addEventListener("hidden.bs.modal", function () {
            streamDropdown.classList.remove("is-open");
            streamTrigger.setAttribute("aria-expanded", "false");
        });

        filterStreams();
    }

    document
        .querySelectorAll(".teacher-document-modal")
        .forEach(initStreamDropdown);

    document.addEventListener("click", function (event) {
        document
            .querySelectorAll("[data-stream-dropdown]")
            .forEach((dropdown) => {
                const trigger = dropdown.querySelector("[data-stream-trigger]");

                if (!dropdown.contains(event.target)) {
                    dropdown.classList.remove("is-open");
                    if (trigger) {
                        trigger.setAttribute("aria-expanded", "false");
                    }
                }
            });
    });

    document.addEventListener("submit", function (event) {
        const form = event.target.closest('form[data-chunk-upload="1"]');
        if (!form) {
            return;
        }

        event.preventDefault();
        uploadInChunks(form);
    });
})();
