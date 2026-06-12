Build a modern full-stack web platform for managing a medical scientific congress for ATCCR.



The platform must be inspired by the structure of an existing internal event platform, but it must NOT be a startup/incubator platform. It must be adapted to a scientific medical congress.



Main objective:

Create a complete congress management platform with a public landing page, participant registration, online and manual payment management, scientific program management, speakers, sponsors, scientific abstract submission, scientific committee evaluation, QR badges, check-in, and certificate generation.



The UI must be clean, premium, medical, responsive, and bilingual: French and English.



Use a modern stack:



\* React / Next.js frontend

\* Tailwind CSS

\* Node.js / Express or Next.js API routes

\* PostgreSQL or MongoDB

\* Authentication with role-based access control

\* File upload support

\* PDF generation for badges, invoices, receipts, and certificates

\* QR code generation and scanning

\* Admin dashboard



Do not use the words startup, incubator, pitch, business competition, investor, or founder anywhere in the ATCCR version.



Replace the existing startup logic with scientific work submission logic.



GLOBAL ROLES



Create the following user roles:



1\. Super Admin

&#x20;  Full access to everything.



2\. Congress Admin

&#x20;  Can manage event content, registrations, program, speakers, sponsors, badges, media, and certificates.



3\. Registration Manager

&#x20;  Can view and manage participants, payments, registrations, badges, check-in.



4\. Finance Manager

&#x20;  Can validate payments, upload payment proofs, generate receipts and invoices, export financial data.



5\. Scientific Committee Admin

&#x20;  Can manage submissions, assign evaluators, see all evaluations, make final decisions.



6\. Scientific Evaluator / Jury Member

&#x20;  Can evaluate assigned scientific submissions only.



7\. Speaker

&#x20;  Can access personal profile, sessions, certificates, and congress information.



8\. Resident / Submitter

&#x20;  Can register, submit scientific works, track status, receive decision, download certificate if authorized.



9\. Participant

&#x20;  Can register, pay, access badge, program, and certificate after attendance validation.



10\. Sponsor / Partner

&#x20;   Can access sponsor area if needed, upload logo, view package information.



11\. Staff / Check-in Agent

&#x20;   Can only scan QR badges and validate attendance.



PUBLIC WEBSITE



Create a public landing page for the congress.



Main navigation:



\* À propos

\* Thématiques

\* Programme

\* Intervenants

\* Partenaires

\* Billetterie

\* Soumission scientifique

\* Se connecter

\* S’inscrire



The admin must be able to edit all public content from the back-office:



\* congress name

\* logo

\* colors

\* hero title

\* hero subtitle

\* hero image

\* dates

\* venue

\* description

\* sections visibility

\* menu labels

\* CTA buttons

\* public images



Hero section:



\* Main congress title

\* Subtitle

\* Short description

\* CTA 1: S’inscrire

\* CTA 2: Voir le programme

\* CTA 3: Soumettre un travail scientifique



À propos section:



\* congress description

\* date

\* venue

\* city

\* organizer

\* target audience

\* format: onsite, hybrid, online

\* key figures: participants, speakers, sessions, workshops, sponsors



Thématiques section:

Display scientific topics as cards with:



\* title

\* description

\* icon

\* display order

\* visible/hidden status

\* linked scientific sessions



Example themes:



\* Chirurgie colorectale

\* Cancérologie digestive

\* Pelvi-périnéologie

\* Endoscopie interventionnelle

\* Innovation et IA en chirurgie

\* Formation des jeunes chirurgiens

\* Cas cliniques complexes

\* Complications et prise en charge



Programme section:

Display a timeline by day with filters:



\* day

\* type

\* speaker

\* room

\* keyword search



Session types:



\* Plénière

\* Conférence

\* Symposium

\* Table ronde

\* Communication orale

\* Session posters

\* Session vidéo

\* Masterclass

\* Workshop pratique

\* Débat expert

\* Cas clinique interactif

\* Pause-café

\* Déjeuner

\* Dîner

\* Cérémonie

\* Assemblée générale

\* Session sponsorisée



Each session must have:



\* title

\* description

\* day

\* start time

\* end time

\* room

\* session type

\* speakers

\* moderators

\* chairpersons

\* sponsor if applicable

\* language

\* public/private status

\* capacity if limited

\* access type: included or paid option

\* order

\* add to personal agenda button



Speakers section:

Display speakers as cards and detail pages.



Speaker fields:



\* photo

\* full name

\* academic title

\* specialty

\* institution

\* department

\* country

\* city

\* short bio

\* long bio

\* LinkedIn

\* ORCID

\* ResearchGate

\* website

\* role: speaker, moderator, chairperson, trainer, international guest, committee member

\* linked sessions

\* visible/hidden

\* order



Partners / Sponsors section:

Display sponsors by category.



Sponsor fields:



\* name

\* logo

\* category: institutional, platinum, gold, silver, bronze, scientific partner, media partner, exhibitor

\* website

\* public description

\* contact name

\* contact email

\* phone

\* sponsor package

\* sponsor amount

\* payment status

\* booth number

\* contract file

\* invoice file

\* visible/hidden

\* display order



Media \& Press section:

Admin can add articles, videos, interviews, press releases, photo galleries, YouTube links, LinkedIn links.



Media fields:



\* type: article, video, interview, press release, photo, publication

\* title

\* source

\* URL

\* thumbnail

\* publication date

\* visible/hidden

\* order



REGISTRATION AND TICKETING



Participants must be able to register from the public website.



Registration form must include:



\* first name

\* last name

\* email

\* phone

\* country

\* city

\* specialty

\* professional grade

\* institution / hospital / clinic

\* department

\* category

\* selected ticket

\* selected paid options

\* billing information

\* consent checkbox

\* terms acceptance



Participant categories:



\* Médecin spécialiste

\* Résident

\* Étudiant

\* Paramédical

\* Invité

\* Speaker

\* Membre du comité scientifique

\* Sponsor / exposant

\* Presse

\* Staff organisation



Ticket system:

Admin can create ticket types with:



\* ticket name

\* description

\* category eligibility

\* price

\* currency: TND, EUR

\* early bird price

\* early bird deadline

\* normal price

\* on-site price

\* quota

\* active/inactive

\* included options

\* paid add-ons



Examples:



\* Participant spécialiste

\* Résident

\* Étudiant

\* Workshop only

\* Masterclass

\* Dîner de gala

\* Invité

\* Speaker

\* Sponsor badge



Payment logic:

The platform must support both:



1\. Online payment

2\. Manual payment / pay on-site / bank transfer proof



Payment statuses:



\* Not paid

\* Awaiting payment

\* Awaiting proof validation

\* Paid online

\* Paid manually

\* Payment proof accepted

\* Payment proof rejected

\* Pay on-site

\* Cancelled

\* Refunded

\* Free / invited

\* Exempted



Early bird logic:

If the participant pays online before the early bird deadline, they benefit from the reduced price.

If they choose to pay on-site, they lose the early bird discount and must pay the full on-site price.



Admin reservation module:

Display:



\* total registrations

\* pending registrations

\* paid registrations

\* confirmed registrations

\* unpaid registrations

\* total confirmed revenue

\* expected revenue

\* filters by status, category, ticket, payment proof, masterclass, date

\* search by name, email, institution, reference



Reservation table columns:



\* checkbox

\* reference

\* ticket type

\* participant

\* institution / department

\* status

\* amount

\* payment status

\* date

\* actions



Reservation detail modal must include tabs:



1\. Information

2\. Institution

3\. Billing

4\. Payment

5\. Badge

6\. Attendance

7\. Certificate



Information tab:



\* full name

\* email

\* phone

\* role / grade

\* specialty

\* category



Institution tab:



\* institution name

\* department

\* address

\* city

\* country



Billing tab:



\* selected ticket

\* selected options

\* subtotal

\* VAT if applicable

\* total

\* invoice details

\* receipt download



Payment tab:



\* payment method

\* payment status

\* proof upload

\* proof preview

\* validate payment

\* reject payment

\* add internal comment



Actions on each reservation:



\* view details

\* edit registration

\* confirm

\* mark as paid

\* mark as pay on-site

\* reject payment proof

\* cancel

\* delete

\* generate badge

\* print badge

\* resend confirmation email

\* generate receipt

\* generate invoice

\* export row

\* mark attendance



CSV import/export:

Admin can export registrations to CSV/Excel.

Admin can import registrations from CSV with validation and duplicate detection.



SCIENTIFIC SUBMISSION MODULE



Replace all startup/candidature/incubator logic by scientific submission logic.



Public menu label:



\* Soumission scientifique

&#x20; or

\* Appel à communications



Public CTA:



\* Soumettre un travail scientifique

\* Déposer mon abstract



Target users:

Residents, young surgeons, specialists, and participants can submit scientific works.



Submission types:



\* Communication orale

\* Poster scientifique

\* Cas clinique

\* Série de cas

\* Vidéo opératoire

\* Travail de recherche

\* Mémoire / travail de fin de formation

\* Projet d’innovation chirurgicale



Submission form:



\* submitter first name

\* submitter last name

\* email

\* phone

\* institution

\* department

\* city

\* country

\* grade: resident, intern, assistant, young specialist, specialist

\* residency year if applicable

\* supervisor / head of department

\* title of work

\* submission type

\* scientific theme

\* authors list

\* presenting author

\* author affiliations

\* abstract text

\* keywords

\* conflict of interest declaration

\* patient consent/anonymization checkbox if case report or video

\* ethics confirmation checkbox

\* terms acceptance



For abstract text, use a structured format:



\* Introduction

\* Objective

\* Methods

\* Results

\* Conclusion



Allow admin to decide whether file upload is enabled or not.

For MVP, abstract text submission is enough.

Optional uploads:



\* PDF

\* poster

\* image

\* video link

\* video file if enabled



Submission statuses:



\* Draft

\* Submitted

\* Pending

\* Under review

\* Accepted

\* Rejected

\* Accepted with modifications

\* Withdrawn

\* Scheduled in program

\* Certificate authorized



Participant/resident dashboard:

The submitter can:



\* create a submission

\* save draft

\* submit before deadline

\* see submission status

\* edit before deadline if allowed

\* receive accepted/rejected decision

\* upload final version if requested

\* see presentation instructions

\* download certificate only if admin authorizes it after congress attendance/presentation validation



Scientific admin dashboard:

Admin can:



\* see all submissions

\* filter by status, theme, type, author, institution, evaluator

\* open submission details

\* assign evaluators

\* change status

\* accept

\* reject

\* request modifications

\* send decision email

\* export submissions to Excel

\* link accepted submissions to scientific program

\* authorize certificate generation after presentation



EVALUATION MODULE



This is a preselection process, not a prize competition.



Do not include prizes, startup ranking, pitch ranking, investor logic, or “coup de cœur” logic.



The scientific committee evaluates submitted works.

Evaluation is anonymous for the participant.

The admin can see evaluators and all details.



Evaluator interface:

Each evaluator sees only assigned submissions.

For each assigned submission, the evaluator can:



\* open details

\* read title and abstract

\* score using a scientific grid

\* add confidential comments for admin

\* submit evaluation

\* edit evaluation if admin allows

\* see progress of assigned evaluations



Evaluation assignment:

Admin chooses how many evaluators are assigned to each submission.

Default: configurable number, for example 2 or 3.

Admin can manually assign evaluators.



Evaluation grid:

Score each criterion from 0 to 10:



\* Scientific relevance

\* Originality

\* Methodological quality

\* Clinical interest

\* Clarity of abstract

\* Quality of expected presentation

\* Ethical compliance



Calculate:



\* total score

\* average score

\* number of evaluations

\* evaluation completion rate



Admin evaluation dashboard:

Show:



\* total submissions

\* submissions evaluated

\* submissions waiting for evaluation

\* total evaluations

\* active evaluators

\* evaluator progress

\* average score per submission

\* final decision status



Do not show leaderboard publicly.

The final decision is:



\* Accepted

\* Rejected

\* Accepted with modifications



Evaluation detail:

Admin can see:



\* evaluator name

\* score

\* comments

\* date

\* final decision

\* reset evaluation if needed



PROGRAM LINK WITH ACCEPTED SUBMISSIONS



Accepted submissions can be converted into program sessions:



\* communication orale

\* poster session

\* video session



When admin accepts a submission, allow:



\* assign presentation day

\* assign time

\* assign room

\* assign session

\* assign presentation duration

\* mark as presented after congress



CERTIFICATES



Generate certificates from inside the platform.



Certificate types:



\* Attestation de participation

\* Attestation de communication orale

\* Attestation de poster

\* Attestation de présentation vidéo

\* Attestation intervenant

\* Attestation modérateur

\* Attestation membre du comité scientifique

\* Attestation formateur masterclass



Certificate rules:



\* Participant certificate available only after check-in/attendance validation.

\* Presentation certificate available only after admin or scientific committee validates that the work was presented.

\* Speaker/moderator certificate available after admin validation.

\* Certificates can be enabled/disabled per user.

\* Admin can generate certificates individually or in bulk.



Certificate fields:



\* participant full name

\* congress name

\* congress dates

\* congress venue

\* certificate type

\* session title or work title if applicable

\* QR code or unique verification code

\* signature image

\* stamp image

\* template background



Admin must be able to upload certificate templates.



BADGES AND QR CHECK-IN



Generate simple QR code badges similar to the existing platform.



Badge fields:



\* congress logo

\* date

\* venue

\* participant full name

\* category

\* ticket type

\* QR code unique

\* color by role/category



Badge categories with colors:



\* Participant

\* Speaker

\* Moderator

\* Scientific committee

\* Resident

\* Sponsor

\* Staff

\* Press

\* Guest

\* VIP



Badge functions:



\* generate individual badge

\* generate badges in bulk

\* print paid badges only

\* print by category

\* export PNG

\* export PDF A5/A6

\* mark badge as printed

\* reprint badge

\* search badges by name, reference, email, institution

\* filter by ticket and category



QR scanner:

Create a scanner page for staff.

It must support:



\* camera QR scan

\* manual reference entry

\* check-in validation

\* session-specific access validation



When QR is scanned, display:



\* full name

\* ticket type

\* category

\* institution

\* payment status

\* access status

\* check-in status

\* previous scan count

\* badge printed or not



Rules:



\* Paid participant: access allowed

\* Free/invited participant: access allowed

\* Pay-on-site: warning and manual decision

\* Unpaid participant: access denied or warning depending admin settings

\* Already checked-in: warning

\* Unknown QR: access denied

\* Masterclass access must be validated separately if masterclass is paid or limited



SPONSORS AND PARTNERS



Admin can manage:



\* partner/sponsor list

\* logos

\* categories

\* order

\* website

\* visibility

\* contact details

\* package

\* amount

\* payment status

\* booth number

\* uploaded contract

\* uploaded invoice



MEDIA LIBRARY



Create a media library with categories:



\* sponsor logos

\* partner logos

\* institution logos

\* speaker photos

\* committee photos

\* public website images

\* press files

\* badge templates

\* certificate templates

\* official posters



Functions:



\* upload

\* rename

\* replace file

\* delete

\* download

\* multi-select download as ZIP

\* tag

\* associate file with speaker/sponsor/session

\* display file type and size



MEDIA \& PRESS ADMIN



Admin can manage public media items:



\* articles

\* videos

\* interviews

\* press releases

\* photo galleries

\* publications



Each media item:



\* title

\* type

\* source

\* URL

\* thumbnail

\* language

\* date

\* visible/hidden

\* display order



EMAIL NOTIFICATIONS



Create automated emails for:



\* account creation

\* registration confirmation

\* payment pending

\* payment validated

\* payment rejected

\* online payment received

\* badge available

\* submission received

\* submission under review

\* submission accepted

\* submission rejected

\* modifications requested

\* presentation instructions

\* certificate available

\* event reminder

\* password reset



Admin can edit email templates in French and English.



ADMIN SETTINGS



Create a settings area where Super Admin can configure:



\* congress name

\* logo

\* favicon

\* colors

\* languages

\* dates

\* venue

\* registration opening/closing dates

\* early bird deadline

\* abstract submission opening/closing dates

\* certificate availability date

\* ticket types

\* participant categories

\* session types

\* submission types

\* scientific themes

\* payment methods

\* online payment provider

\* bank transfer instructions

\* email templates

\* badge template

\* certificate template

\* user roles and permissions



DASHBOARD



Admin dashboard must show:



\* total registrations

\* paid registrations

\* pending registrations

\* confirmed revenue

\* expected revenue

\* unpaid amount

\* number of speakers

\* number of sponsors

\* number of scientific submissions

\* accepted submissions

\* rejected submissions

\* submissions under review

\* number of sessions

\* check-in count

\* badges printed

\* certificates generated

\* recent registrations

\* recent submissions

\* payment alerts

\* evaluator progress



SECURITY AND DATA



Use secure authentication.

Passwords must be hashed.

Use role-based access control.

Protect uploaded files.

Do not expose private evaluator comments to participants.

Do not expose evaluator identity to participants.

Allow admin-only visibility for sensitive information.

Add audit logs for:



\* payment validation

\* submission decision

\* certificate authorization

\* badge generation

\* user role changes



MVP PRIORITY



Build the MVP in this order:



1\. Authentication and roles

2\. Public landing page

3\. Registration and ticketing

4\. Payment status management, online payment placeholder, manual payment proof

5\. Admin reservation dashboard

6\. QR badge generation

7\. QR scanner and check-in

8\. Program management

9\. Speakers management

10\. Sponsors management

11\. Scientific submission module

12\. Scientific evaluation module

13\. Certificate generation

14\. Media library

15\. Email templates

16\. Bilingual French/English interface



Design style:

Premium medical congress design.

Clean layout.

Dark blue, teal, white, light gray.

Rounded cards.

Modern dashboard.

Responsive desktop and mobile.

Admin sidebar similar to modern SaaS dashboards.

Avoid childish colors.

Avoid startup vocabulary.

Everything should feel like a professional medical scientific congress platform.



