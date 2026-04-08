# Road Safety Project Implementation Phases

## Phase 1: Geospatial Foundation
- [x] Choose and configure the free map stack
- [x] Integrate Leaflet map into the Laravel frontend
- [x] Add a reusable map container/component for admin and public screens
- [x] Support coordinate picking from the map
- [x] Add reverse geocoding for location name lookup
- [x] Define a common GeoJSON-style structure for storing map shapes
- [x] Add environment/config entries for map and geocoding services

## Phase 2: Road Segmentation Module
- [ ] Create CRUD routes and controller for road segments
- [ ] Build UI to draw road segments on the map
- [ ] Save segment boundary/polyline coordinates into the database
- [ ] Support segment type, description, and estimated length
- [ ] Show existing segments on the map with edit/delete actions
- [ ] Validate geometry before saving

## Phase 3: Road Rules Module
- [ ] Create CRUD routes and controller for road rules
- [ ] Link each road rule to a road segment
- [ ] Add rule types such as speed limit, no parking, one way, school zone
- [ ] Support rule start/end dates and active status
- [ ] Build UI to place or attach rules on mapped segments
- [ ] Add validation for rule values and location coverage

## Phase 4: Report Mapping and Matching
- [ ] Add report map picker for anonymous reporting
- [ ] Capture latitude, longitude, and location name from the map
- [ ] Match reports to the nearest road segment
- [ ] Match reports to related road rules where possible
- [ ] Store matched segment/rule references for review
- [ ] Show mapped reports on officer screens

## Phase 5: Evidence and Review Workflow
- [ ] Upload and manage evidence files for reports
- [ ] Build officer review dashboard
- [ ] Add status updates, notes, and assignment workflow
- [ ] Show report details together with map context
- [ ] Add filters by status, date, segment, and rule type

## Phase 6: Hotspot Analysis and Visualization
- [ ] Aggregate reports by area/segment/rule
- [ ] Generate hotspot records from repeated incidents
- [ ] Visualize hotspots on the map
- [ ] Add severity and frequency indicators
- [ ] Show trend summaries for officers

## Phase 7: Security, Audit, and Quality
- [ ] Log sensitive actions in audit trails
- [ ] Add authorization checks for officer/admin actions
- [ ] Add tests for geospatial workflows and validations
- [ ] Add seed data for road segments, rules, and sample reports
- [ ] Review performance for map queries and uploads
