@extends('layouts.app')
@section('content')
    <div class="container py-4">
        <!-- Science Department -->
        <section class="mb-5">
            <h2 class="fw-bold text-primary">Science Department</h2>
            <p>The Science Department provides students with hands-on learning in Physics, Chemistry, and Biology, nurturing
                critical thinking and innovation.</p>
            <div class="row align-items-center mb-3">
                <div class="col-auto">
                    <img src="{{ asset('img/hod_science.jpg') }}" alt="Head of Science" class="rounded-circle border shadow"
                        width="90" height="90" style="object-fit: cover;">
                </div>
                <div class="col">
                    <h4>Dr. Jane Doe</h4>
                    <span class="text-muted">Head of Science Department</span>
                    <p>Welcome to the Science Department! We are committed to inspiring curiosity and excellence in every
                        student.</p>
                </div>
            </div>
            <h5 class="fw-bold mb-2">Staff Members</h5>
            <div class="row g-3 mb-3">
                <div class="col-6 col-md-3 text-center">
                    <img src="{{ asset('img/staff1.jpg') }}" class="rounded-circle border shadow" width="60"
                        height="60" style="object-fit: cover;">
                    <div class="mt-2">Mr. John Smith<br><small class="text-muted">Physics Teacher</small></div>
                </div>
                <div class="col-6 col-md-3 text-center">
                    <img src="{{ asset('img/staff2.jpg') }}" class="rounded-circle border shadow" width="60"
                        height="60" style="object-fit: cover;">
                    <div class="mt-2">Ms. Mary Johnson<br><small class="text-muted">Chemistry Teacher</small></div>
                </div>
                <div class="col-6 col-md-3 text-center">
                    <img src="{{ asset('img/staff3.jpg') }}" class="rounded-circle border shadow" width="60"
                        height="60" style="object-fit: cover;">
                    <div class="mt-2">Mr. Alex Lee<br><small class="text-muted">Biology Teacher</small></div>
                </div>
            </div>
            <h5 class="fw-bold mb-2">Subjects Offered</h5>
            <ul>
                <li>Physics (Form I - VI)</li>
                <li>Chemistry (Form I - VI)</li>
                <li>Biology (Form I - VI)</li>
                <li>Mathematics (Form I - IV)</li>
            </ul>
            <h5 class="fw-bold mb-2">Facilities & Resources</h5>
            <div class="row g-3 mb-3">
                <div class="col-md-4">
                    <img src="{{ asset('img/lab1.jpg') }}" class="img-fluid rounded shadow" alt="Physics Lab">
                    <small class="d-block text-muted mt-1">Physics Laboratory</small>
                </div>
                <div class="col-md-4">
                    <img src="{{ asset('img/library.jpg') }}" class="img-fluid rounded shadow" alt="Library">
                    <small class="d-block text-muted mt-1">Department Library</small>
                </div>
            </div>
            <h5 class="fw-bold mb-2">Student Achievements</h5>
            <div class="row g-3">
                <div class="col-md-4">
                    <img src="{{ asset('img/award1.jpg') }}" class="img-fluid rounded shadow" alt="ICT Expo">
                    <small class="d-block text-muted mt-1">Form Five students presenting their project at the National ICT
                        Expo 2024.</small>
                </div>
            </div>
        </section>

        <!-- Arts Department -->
        <section class="mb-5">
            <h2 class="fw-bold text-success">Arts Department</h2>
            <p>The Arts Department fosters creativity and expression through literature, history, and languages, helping
                students develop communication and analytical skills.</p>
            <div class="row align-items-center mb-3">
                <div class="col-auto">
                    <img src="{{ asset('img/hod_arts.jpg') }}" alt="Head of Arts" class="rounded-circle border shadow"
                        width="90" height="90" style="object-fit: cover;">
                </div>
                <div class="col">
                    <h4>Ms. Linda Brown</h4>
                    <span class="text-muted">Head of Arts Department</span>
                    <p>Welcome to the Arts Department! We encourage students to explore their talents and broaden their
                        perspectives.</p>
                </div>
            </div>
            <h5 class="fw-bold mb-2">Staff Members</h5>
            <div class="row g-3 mb-3">
                <div class="col-6 col-md-3 text-center">
                    <img src="{{ asset('img/staff5.jpg') }}" class="rounded-circle border shadow" width="60"
                        height="60" style="object-fit: cover;">
                    <div class="mt-2">Mr. Peter White<br><small class="text-muted">Literature Teacher</small></div>
                </div>
                <div class="col-6 col-md-3 text-center">
                    <img src="{{ asset('img/staff6.jpg') }}" class="rounded-circle border shadow" width="60"
                        height="60" style="object-fit: cover;">
                    <div class="mt-2">Ms. Susan Green<br><small class="text-muted">History Teacher</small></div>
                </div>
            </div>
            <h5 class="fw-bold mb-2">Subjects Offered</h5>
            <ul>
                <li>Literature (Form I - VI)</li>
                <li>History (Form I - VI)</li>
                <li>Kiswahili (Form I - IV)</li>
                <li>English Language (Form I - IV)</li>
            </ul>
            <h5 class="fw-bold mb-2">Facilities & Resources</h5>
            <div class="row g-3 mb-3">
                <div class="col-md-4">
                    <img src="{{ asset('img/arts_room.jpg') }}" class="img-fluid rounded shadow" alt="Arts Room">
                    <small class="d-block text-muted mt-1">Arts Room</small>
                </div>
            </div>
            <h5 class="fw-bold mb-2">Student Achievements</h5>
            <div class="row g-3">
                <div class="col-md-4">
                    <img src="{{ asset('img/award4.jpg') }}" class="img-fluid rounded shadow"
                        alt="Literature Competition">
                    <small class="d-block text-muted mt-1">Students winning the National Literature Competition.</small>
                </div>
            </div>
        </section>

        <!-- Business Department -->
        <section class="mb-5">
            <h2 class="fw-bold text-warning">Business Department</h2>
            <p>The Business Department equips students with practical skills in commerce, accounting, and entrepreneurship,
                preparing them for the modern business world.</p>
            <div class="row align-items-center mb-3">
                <div class="col-auto">
                    <img src="{{ asset('img/hod_business.jpg') }}" alt="Head of Business"
                        class="rounded-circle border shadow" width="90" height="90" style="object-fit: cover;">
                </div>
                <div class="col">
                    <h4>Mr. David Black</h4>
                    <span class="text-muted">Head of Business Department</span>
                    <p>Welcome to the Business Department! We focus on developing future leaders and entrepreneurs.</p>
                </div>
            </div>
            <h5 class="fw-bold mb-2">Staff Members</h5>
            <div class="row g-3 mb-3">
                <div class="col-6 col-md-3 text-center">
                    <img src="{{ asset('img/staff7.jpg') }}" class="rounded-circle border shadow" width="60"
                        height="60" style="object-fit: cover;">
                    <div class="mt-2">Ms. Carol Adams<br><small class="text-muted">Commerce Teacher</small></div>
                </div>
                <div class="col-6 col-md-3 text-center">
                    <img src="{{ asset('img/staff8.jpg') }}" class="rounded-circle border shadow" width="60"
                        height="60" style="object-fit: cover;">
                    <div class="mt-2">Mr. Brian Clark<br><small class="text-muted">Accounting Teacher</small></div>
                </div>
            </div>
            <h5 class="fw-bold mb-2">Subjects Offered</h5>
            <ul>
                <li>Commerce (Form III - VI)</li>
                <li>Bookkeeping (Form III - IV)</li>
                <li>Accounting (Form V - VI)</li>
                <li>Entrepreneurship (Form V - VI)</li>
            </ul>
            <h5 class="fw-bold mb-2">Facilities & Resources</h5>
            <div class="row g-3 mb-3">
                <div class="col-md-4">
                    <img src="{{ asset('img/business_lab.jpg') }}" class="img-fluid rounded shadow" alt="Business Lab">
                    <small class="d-block text-muted mt-1">Business Simulation Lab</small>
                </div>
            </div>
            <h5 class="fw-bold mb-2">Student Achievements</h5>
            <div class="row g-3">
                <div class="col-md-4">
                    <img src="{{ asset('img/award5.jpg') }}" class="img-fluid rounded shadow" alt="Business Fair">
                    <small class="d-block text-muted mt-1">Students presenting at the National Business Fair.</small>
                </div>
            </div>
        </section>

        <!-- ICT Department -->
        <section class="mb-5">
            <h2 class="fw-bold text-info">ICT Department</h2>
            <p>The ICT Department empowers students with digital skills in computer science, programming, and information
                technology, preparing them for the future.</p>
            <div class="row align-items-center mb-3">
                <div class="col-auto">
                    <img src="{{ asset('img/hod_ict.jpg') }}" alt="Head of ICT" class="rounded-circle border shadow"
                        width="90" height="90" style="object-fit: cover;">
                </div>
                <div class="col">
                    <h4>Ms. Angela White</h4>
                    <span class="text-muted">Head of ICT Department</span>
                    <p>Welcome to the ICT Department! We are dedicated to fostering innovation and digital literacy.</p>
                </div>
            </div>
            <h5 class="fw-bold mb-2">Staff Members</h5>
            <div class="row g-3 mb-3">
                <div class="col-6 col-md-3 text-center">
                    <img src="{{ asset('img/staff9.jpg') }}" class="rounded-circle border shadow" width="60"
                        height="60" style="object-fit: cover;">
                    <div class="mt-2">Mr. Kevin Brown<br><small class="text-muted">ICT Teacher</small></div>
                </div>
            </div>
            <h5 class="fw-bold mb-2">Subjects Offered</h5>
            <ul>
                <li>Computer Studies (Form I - IV)</li>
                <li>Information Technology (Form V - VI)</li>
                <li>Programming (Form V - VI)</li>
            </ul>
            <h5 class="fw-bold mb-2">Facilities & Resources</h5>
            <div class="row g-3 mb-3">
                <div class="col-md-4">
                    <img src="{{ asset('img/ict_lab.jpg') }}" class="img-fluid rounded shadow" alt="ICT Lab">
                    <small class="d-block text-muted mt-1">ICT Laboratory</small>
                </div>
            </div>
            <h5 class="fw-bold mb-2">Student Achievements</h5>
            <div class="row g-3">
                <div class="col-md-4">
                    <img src="{{ asset('img/award6.jpg') }}" class="img-fluid rounded shadow" alt="ICT Competition">
                    <small class="d-block text-muted mt-1">Students winning the National ICT Competition.</small>
                </div>
            </div>
        </section>
    </div>
@endsection
