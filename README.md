# Music Store Generator

An advanced, full-stack web application designed to generate a massive, infinite list of randomized yet deterministic music data. Utilizing a seed-based generation strategy, the platform ensures that any user, anywhere, will see the exact same song details, likes, and audio tracks when using the same seed and locale.

---

##  Core Features

* **Infinite Scroll Architecture**: Seamlessly fetches and appends data as the user scrolls, supporting a virtually bottomless catalog of music.
* **Deterministic Data Generation**: Uses mathematical seeding to ensure that "Song #45" for Seed 12345 is identical across all sessions.
* **Localized Metadata**: Supports multiple regions (e.g., English, Ukrainian) with localized artist names and titles using the Bogus library.
* **Interactive Detail View**: A "click-to-expand" UI pattern that reveals rich media, including album art, lyrics, and a functional audio player.
* **Probabilistic Likes Engine**: Implements a fractional "Average Likes" algorithm. If the slider is set to 5.5, every song has a 50% chance of having 5 likes and a 50% chance of having 6 likes.
* **Real-time Controls**: Instant UI updates when adjusting the Seed, Region, or Likes slider without requiring a full page reload.
## Backend Architecture (ASP.NET Core)

The backend is built with C# and ASP.NET Core, emphasizing high-performance data synthesis rather than traditional database querying.

### 1. Data Synthesis Engine (DataGenerator.cs)
Instead of storing millions of records, the backend generates data on-the-fly.

* **Seeding Logic**: It calculates a unique `pageSeed` using a Linear Congruential Generator approach:
    $$(userSeed \times 6364136223846793005L) + pageIndex$$
    This ensures that even if a user starts at page 10, the data remains consistent with the global sequence.
* **Bogus Integration**: Utilizes the Bogus library to create realistic fake data. It maps the incoming locale to specific datasets (e.g., `uk` for Ukrainian) to ensure linguistic accuracy.

### 2. API Design (MusicController.cs)
The RESTful API provides a single GET endpoint: `/api/music`.

* **Parameters**: Accepts `locale`, `seed`, `page`, and `likes`.
* **Statelessness**: The controller is entirely stateless; it doesn't require a database, making it horizontally scalable and extremely fast.

### 3. Procedural Media Mapping
* **Deterministic Audio**: The backend assigns audio tracks by performing a modulo operation on the seed, ensuring the same track is always associated with the same song record.
* **Dynamic Lyrics**: Generated using a combination of `Hacker.Phrase()` and `Company.CatchPhrase()` to simulate creative, abstract songwriting.
## Frontend & UI Logic

The frontend is a lightweight, "Vanilla JS" implementation optimized for speed and DOM efficiency.

### Expandable Row Pattern
The UI uses a dual-row table strategy:
* **.song-row**: Displays the primary metadata (Index, Title, Artist, Likes).
* **.detail-row**: A hidden row that contains the `detail-content` flexbox.

When a user clicks a row, the `toggleDetails(index)` function is triggered, which handles:
1. Switching display between `none` and `table-row`.
2. Swapping the SVG chevron/arrow indicator ($\blacktriangleright$ vs $\blacktriangledown$).

### Responsive Styling (site.css)
* **Transitions**: Smooth `background-color` transitions on hover for better UX.
* **Media Containers**: Album art is processed with `object-fit: cover` and a soft `box-shadow` to maintain a modern aesthetic regardless of the image aspect ratio provided by the placeholder service.

---

##  Technical Specifications

| Component | Technology |
| :--- | :--- |
| **Framework** | ASP.NET Core 8.0+ |
| **Data Generation** | Bogus (C#) |
| **Frontend** | Vanilla JavaScript (ES6+), CSS3, HTML5 |
| **Audio** | HTML5 Audio API (Streaming via SoundHelix) |
| **Images** | Picsum Photos (Seed-based) |
##  Setup and Installation

Follow these steps to get the environment running locally:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/shahedul-islam-joshi/.NET-API-music-store-generator](https://github.com/shahedul-islam-joshi/.NET-API-music-store-generator)
    ```

2.  **Install dependencies:**
    ```bash
    dotnet add package Bogus
    ```

3.  **Run the Application:**
    ```bash
    dotnet run
    ```

---
##  Project Structure

Below is the detailed directory structure for the **Music Store Generator**, showcasing the organization of the ASP.NET Core MVC architecture:

```text
MusicStoreApp/
├── Controllers/
│   ├── HomeController.cs        # Handles main page routing
│   └── MusicController.cs       # REST API providing the music data endpoint
├── Models/
│   ├── Domain Model/
│   │   └── Song.cs              # Core data structure for a Music track
│   └── ErrorViewModel.cs        # Standard error handling model
├── Resources/                   # Localization files
│   ├── en-US.json               # English language metadata
│   └── uk-UA.json               # Ukrainian language metadata
├── Services/                    # Core Business Logic
│   ├── DataGenerator.cs         # Implements deterministic seeding and Bogus logic
│   └── MusicSynthesizer.cs      # Service for orchestrating data creation
├── Views/                       # Frontend UI (Razor Pages)
│   ├── Home/
│   │   ├── Index.cshtml         # Main application interface & Infinite Scroll
│   │   └── Privacy.cshtml       # Privacy policy page
│   └── Shared/                  # Global layouts and partials
├── wwwroot/                     # Static assets (CSS, Vanilla JS, Images)
├── .gitignore                   # Excludes build artifacts from Git
├── appsettings.json             # Application configuration
├── Dockerfile                   # Containerization instructions
├── LICENSE                      # Project license information
├── Program.cs                   # Application entry point and service registration
└── README.md                    # Project documentation