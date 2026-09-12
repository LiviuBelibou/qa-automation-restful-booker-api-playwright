Restful Booker API Test Automation

An API automation portfolio project using Playwright and TypeScript to test authentication and booking workflows in Restful Booker.

The suite sends HTTP requests directly, without opening a browser, using Playwright's API testing capabilities. It demonstrates reusable API clients, test fixtures, centralized test data, positive and negative scenarios, response assertions, and JSON schema validation.

This is an independent practice project, not a claim of production automation experience or complete API coverage.

Current status

Nine scenarios across three test files, with one Playwright project named api.

Local TypeScript, ESLint, formatting checks, and all nine tests passed during setup.

The first GitHub Actions run passed all nine tests and code-quality checks. The HTML report was uploaded successfully.

The main branch is protected by the active protect-main ruleset.

Technology

Tool

Purpose

Playwright Test

Send API requests, run tests, provide assertions and fixtures, and generate reports

TypeScript

Check types and code usage before execution

AJV and ajv-formats

Validate JSON response structure and date formats at runtime

dotenv

Load local environment settings from .env

ESLint

Detect code-quality issues

Prettier

Apply consistent formatting

GitHub Actions

Run automated quality checks and API tests on GitHub

The project uses CommonJS with TypeScript's NodeNext configuration. Source files use import and export syntax; switching the package to ES modules is not required for this framework.

Project organization

Paths below are relative to the project root.

Path

Responsibility

clients/auth.client.ts

Send authentication requests

clients/booking.client.ts

Send booking requests, including filtering, updates, and deletion

fixtures/api.fixture.ts

Supply API clients and an authentication token to tests

models/

Describe authentication and booking data with TypeScript interfaces

test-data/booking-data.ts

Build fresh booking payloads with optional overrides

schemas/booking.schema.ts

Define the booking response structure checked at runtime

utils/environment.ts

Read and check required authentication settings

utils/schema-validator.ts

Validate response data against a supplied schema

tests/health/health.spec.ts

Check the booking-list endpoint

tests/auth/auth.spec.ts

Test valid and invalid authentication

tests/booking/booking.spec.ts

Test booking workflows

playwright.config.ts

Configure the base URL, headers, execution, retries, and reporting

tsconfig.json

Configure TypeScript checks

eslint.config.mjs

Configure linting

.prettierrc.json and .prettierignore

Configure formatting and exclusions

.env.example

Document the environment settings needed to run locally

.gitignore

Exclude local credentials, dependencies, and generated output from Git

.github/workflows/api-tests.yml

Define GitHub CI checks and report upload

package.json and package-lock.json

Define commands, dependency ranges, and resolved dependency versions

Generated folders such as node_modules/, playwright-report/, and test-results/ are not committed.

Test coverage

Area

Scenario

Main checks

Health

Retrieve the booking list

HTTP 200, JSON content type, and an array response

Authentication

Request a token with valid credentials

HTTP 200, JSON content type, and a truthy token value

Authentication

Request a token with an incorrect password

HTTP 200, Bad credentials reason, and no token property

Booking

Create and retrieve a booking

Creation response, generated numeric ID, retrieved data, and booking schema

Booking

Fully update a booking

PUT response and a subsequent GET match the submitted full payload

Booking

Partially update a booking

PATCH changes selected fields while the remaining data stays unchanged

Booking

Attempt an update with an invalid token

HTTP 403 and the stored booking remains unchanged

Booking

Filter by first and last name

HTTP 200 and the created booking ID appears in the result

Booking

Delete a booking

DELETE returns HTTP 201 and a subsequent GET returns HTTP 404

These are nine scenarios, not nine requests. A single workflow test can send several requests for setup, verification, and cleanup.

The health test checks GET /booking; it does not use /ping. The filter test currently checks inclusion of the matching booking, not exclusion of every nonmatching booking.

Local setup

Requirements

Node.js 24 or newer, as declared in package.json; CI is configured for Node.js 24.

npm.

Network access to the practice API.

Git for version control.

From the project root, install the locked dependencies:

npm ci

For a new local setup, copy the environment template without overwriting an existing .env:

cp -n .env.example .env

Review these settings in .env:

Variable

Purpose

API_BASE_URL

Base address of the Restful Booker practice API

API_USERNAME

Username used to request an authentication token

API_PASSWORD

Password used to request an authentication token

The supplied template uses practice-service settings. Do not put real production credentials in .env.example or commit them to Git. .env is a plain-text local file, not an encrypted secret store.

Run the complete quality check:

npm run check

No Playwright browser installation is needed for these request-only tests.

Commands

Command

Purpose

npm test

Run all nine scenarios

npm run test:auth

Run tests tagged @auth

npm run test:booking

Run tests tagged @booking

npm run test:smoke

Run tests tagged @smoke

npm run test:negative

Run tests tagged @negative

npx playwright test --grep @regression

Run tests tagged @regression

npx playwright test --list

List tests without executing them

npm run typecheck

Check TypeScript without generating JavaScript files

npm run lint

Run ESLint

npm run lint:fix

Apply available ESLint automatic fixes

npm run format

Format supported project files

npm run format:check

Check formatting without changing files

npm run check

Run type checking, linting, formatting checks, and tests in order

npm run report

Open the last locally generated HTML report

To run only the booking file:

npx playwright test tests/booking/booking.spec.ts

After editing files, format and check them:

npm run format
npm run check

npm run check stops at the first failing stage. For example, a TypeScript failure means the API tests have not run yet.

Design decisions

Configuration and test data are separate

The base URL and authentication settings come from environment variables. The Playwright configuration loads .env for local runs, while CI supplies variables through the workflow.

Booking input is built in test-data/booking-data.ts. Each call to buildBooking() returns fresh data; overrides let a test change specific values without repeating the whole payload. The API-generated booking ID is used to identify the record created by each test.

Clients keep request details out of tests

API clients are similar to Page Objects in a UI framework. They contain endpoints, HTTP methods, request bodies, query parameters, and authentication headers. They return responses so tests can check both successful and unsuccessful outcomes.

For example, updateBooking(...) sends a PUT request; the test decides whether HTTP 200 or HTTP 403 is expected for that scenario.

Fixtures provide reusable setup

The custom fixture supplies authClient, bookingClient, and authToken. The token fixture runs only when requested and is test-scoped: each test using it requests its own token before its test body starts.

Protected booking operations send the token in the Cookie header. Authentication tests call the authentication client directly so they can inspect both successful and rejected responses.

TypeScript interfaces and JSON schemas serve different purposes

Interfaces help check the code before execution. A cast such as as CreatedBooking does not validate an actual API response.

AJV checks response data at runtime. The create-and-retrieve test currently validates the retrieved booking with a JSON schema, then separately checks that its values match the submitted data. Schema validation is not yet applied to every response.

The current schema requires additionalneeds and rejects unexpected properties. It describes the complete booking shape used by these tests, not every possible compatible response variation.

Tests own their records

Booking tests create records instead of depending on pre-existing IDs. Cleanup runs in finally blocks and attempts to delete the created booking. The deletion scenario performs deletion as the behavior under test and has fallback cleanup if needed.

Cleanup is best-effort: a network failure, unavailable service, or interrupted process can leave records behind. Tests must never delete unrelated records from the shared service.

The name-filtering test adds a timestamp to its first name to reduce collisions. Timestamps are not a guarantee of uniqueness across simultaneous independent runs.

GitHub Actions

The included workflow is configured to run on:

Pushes to main.

Pull requests targeting main.

Manual invocation through workflow_dispatch.

It checks out the code, sets up Node.js 24, runs npm ci, and executes npm run check. If a Playwright report exists, it is uploaded as an artifact with a 14-day retention period, including after a failed test run.

This repository uses Actions secrets named API_USERNAME and API_PASSWORD for authentication. When setting up your own copy on GitHub, configure those secrets in that repository before running CI. The workflow supplies the practice API base URL directly; it does not need the local .env file.

Secrets are normally unavailable to workflows triggered by pull requests from forks. The current credential-dependent workflow needs a separate policy before supporting external contributions. See GitHub's guidance on using secrets.

CI is configured for one worker and up to two retries per failing test. Local runs use Playwright's default worker allocation with no retries. A retry that passes still deserves investigation; it does not explain the original failure.

The required status-check name is API quality checks. The active protect-main ruleset requires pull requests, passing checks, and branches that are up to date before merging into main. Force pushes and branch deletion are blocked, with no bypass exceptions. Required review approvals are set to zero for this solo project.

Scope and limitations

Restful Booker is a shared practice service. Availability, data resets, or other users can affect results; failures need investigation before being classified as framework defects.

The suite exercises functional API behavior. It is not a performance test, penetration test, or complete security assessment.

The invalid-token scenario checks one access-control behavior, not every authorization risk.

Current expectations include API-specific status codes such as HTTP 200 with an authentication error body and HTTP 201 after deletion. A status code alone is not enough to establish business success.

Filtering exclusion, broader input validation, and schemas for all response types are potential future improvements, not implemented coverage.

Repeated setup and cleanup could later be moved into a booking-lifecycle fixture, with cleanup failures reported separately from the primary test failure.

Author

Liviu Belibou — QA professional developing hands-on API automation skills through an independent portfolio project.
