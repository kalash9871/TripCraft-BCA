/**
 * ==============================================================================
 * TripCraft — Travel Planning Web Application (Frontend Engine)
 * BCA 5th Semester Web Application Development Project
 * ==============================================================================
 * 
 * Features & Architecture:
 * 1. REST API Integration:
 *    - GET  /api/destinations  -> Dynamic fetching of destination metadata
 *    - POST /api/plan-trip     -> Backend budget calculation & itinerary generation
 * 2. Responsive UI Interactions:
 *    - Category filtering (All, Mountains, Coastal, Heritage, Eco)
 *    - Details Modal with verified transit hubs & "Plan Here" auto-fill
 *    - Interactive day-wise itinerary accordion
 *    - Mobile navigation toggle & smooth scroll spy
 * 3. Fallback Dataset:
 *    - Built-in local dataset ensures the frontend remains resilient if offline
 */

// ==================== 1. LOCAL DATASET (FALLBACK & SEED) ====================
let DESTINATIONS_DATA = {
    ziro: {
        id: "ziro",
        name: "Ziro Valley",
        state: "Arunachal Pradesh",
        category: "mountains",
        tag: "Apatani Cultural Haven",
        image: "images/ziro.jpg",
        description: "A tranquil valley cradled by pine-clad hills and emerald paddy terraces, home to the indigenous Apatani tribe known for sustainable farming, traditional wooden bamboo houses, and the famed Ziro Music Festival.",
        bestTime: "March to October (Ziro Festival in late Sept)",
        dailyRateText: "₹1,800 - ₹2,600 / day",
        airport: "Donyi Polo Airport, Itanagar (HGI, ~100 km) / Lilabari (IXI)",
        airportQuery: "Donyi+Polo+Airport+Itanagar",
        railway: "Naharlagun Railway Station (NHN, ~95 km)",
        railwayQuery: "Naharlagun+Railway+Station",
        mapQuery: "Ziro+Valley+Arunachal+Pradesh",
        rates: { stay: 1000, food: 650, transport: 600, activity: 400 },
        highlights: [
            "Apatani tribal villages (Hong, Hari, Hija)",
            "Tarin High-Altitude Fish Farm & Pine Groves",
            "Kardo Shiva Lingam (natural rock formation)",
            "Local organic kiwi orchards & rice beer tasting"
        ]
    },
    tawang: {
        id: "tawang",
        name: "Tawang",
        state: "Arunachal Pradesh",
        category: "mountains",
        tag: "Monasteries & High Passes",
        image: "images/tawang.jpg",
        description: "Perched at an elevation of 10,000 feet near the Indo-Bhutan border, Tawang is renowned for India's largest Buddhist monastery founded in 1681, breathtaking high-altitude mountain passes, and crystal glacial lakes.",
        bestTime: "March to June & September to November",
        dailyRateText: "₹2,200 - ₹3,200 / day",
        airport: "Tezpur Airport (TEZ, ~320 km) / Guwahati (GAU, ~440 km)",
        airportQuery: "Tezpur+Airport",
        railway: "Rangapara North Railway Station (~315 km)",
        railwayQuery: "Rangapara+North+Railway+Station",
        mapQuery: "Tawang+Arunachal+Pradesh",
        rates: { stay: 1200, food: 750, transport: 950, activity: 500 },
        highlights: [
            "Tawang Monastery (Ganden Namgyal Lhatse)",
            "Sela Pass & frozen Sela Lake (13,700 ft)",
            "Madhuri Lake (Sangetsar Tso) mountain bowl",
            "Nuranang Falls (Bap Teng Kang) cascade"
        ]
    },
    majuli: {
        id: "majuli",
        name: "Majuli Island",
        state: "Assam",
        category: "coastal",
        tag: "World's Largest River Island",
        image: "images/majuli.jpg",
        description: "Formed by the mighty Brahmaputra River, Majuli is the world's largest inhabited river island and the heart of Assamese Neo-Vaishnavite culture, renowned for ancient Satras, traditional mask making, and peaceful riverbank life.",
        bestTime: "October to March",
        dailyRateText: "₹1,500 - ₹2,300 / day",
        airport: "Jorhat Airport / Rowriah (JRH, ~20 km + Nimati Ghat ferry)",
        airportQuery: "Jorhat+Airport+Rowriah",
        railway: "Jorhat Town Railway Station (JTTN, ~18 km)",
        railwayQuery: "Jorhat+Town+Railway+Station",
        mapQuery: "Majuli+Island+Assam",
        rates: { stay: 850, food: 550, transport: 450, activity: 350 },
        highlights: [
            "Kamalabari & Auniati Neo-Vaishnavite Satras",
            "Traditional Mukha mask-making at Natun Samaguri",
            "Scenic Brahmaputra sunset ferry crossing",
            "Mishing tribal village hospitality and pottery"
        ]
    },
    gokarna: {
        id: "gokarna",
        name: "Gokarna",
        state: "Karnataka",
        category: "coastal",
        tag: "Pristine Arabian Coast",
        image: "images/gokarna.jpg",
        description: "A tranquil temple town bordered by rugged Western Ghats cliffs and untouched crescent beaches. Offers serene beach treks, golden sands, and cliffside sunsets without the chaotic crowds of mainstream beach destinations.",
        bestTime: "October to March",
        dailyRateText: "₹1,600 - ₹2,500 / day",
        airport: "Goa Dabolim Airport (GOI, ~140 km) / Mopa (GOX)",
        airportQuery: "Goa+International+Airport+Dabolim",
        railway: "Gokarna Road Railway Station (GOK, ~9 km)",
        railwayQuery: "Gokarna+Road+Railway+Station",
        mapQuery: "Gokarna+Karnataka",
        rates: { stay: 950, food: 650, transport: 450, activity: 350 },
        highlights: [
            "Om Beach, Kudle Beach & Half Moon Beach cliff trek",
            "Ancient Mahabaleshwar Temple & Kotitirtha sacred pond",
            "Cliffside yoga and peaceful Arabian sea sunset views",
            "Historic Mirjan Fort day trip"
        ]
    },
    devprayag: {
        id: "devprayag",
        name: "Devprayag",
        state: "Uttarakhand",
        category: "heritage",
        tag: "Sacred Holy Confluence",
        image: "images/devprayag.jpg",
        description: "The mystical mountain town where the gushing turquoise Bhagirathi river meets the calm, silvery Alaknanda river to form the holy River Ganga. Perched dramatically between steep Himalayan river cliffs.",
        bestTime: "Year-Round (Pleasant Oct to April)",
        dailyRateText: "₹1,400 - ₹2,200 / day",
        airport: "Jolly Grant Airport, Dehradun (DED, ~90 km)",
        airportQuery: "Jolly+Grant+Airport+Dehradun",
        railway: "Yog Nagari Rishikesh Railway Station (YNRK, ~70 km)",
        railwayQuery: "Yog+Nagari+Rishikesh+Railway+Station",
        mapQuery: "Devprayag+Uttarakhand",
        rates: { stay: 800, food: 500, transport: 450, activity: 300 },
        highlights: [
            "Confluence (Sangam) of Bhagirathi and Alaknanda",
            "1000-year-old Raghunathji Temple stone architecture",
            "Dramatic pedestrian suspension bridges over the river gorge",
            "Evening riverside aarti along the holy ghats"
        ]
    },
    mawlynnong: {
        id: "mawlynnong",
        name: "Mawlynnong",
        state: "Meghalaya",
        category: "nature",
        tag: "Asia's Cleanest Eco-Village",
        image: "images/mawlynnong.jpg",
        description: "Renowned as 'God's Own Garden', this eco-conscious Khasi tribal village maintains 100% cleanliness with bamboo waste bins, flowering pathways, nearby bio-engineered living root bridges, and views overlooking Bangladesh.",
        bestTime: "September to May (Lush post-monsoon greenery)",
        dailyRateText: "₹1,700 - ₹2,600 / day",
        airport: "Shillong Airport, Umroi (SHL, ~90 km) / Guwahati (GAU)",
        airportQuery: "Shillong+Airport+Umroi",
        railway: "Guwahati Railway Station (GHY, ~170 km)",
        railwayQuery: "Guwahati+Railway+Station",
        mapQuery: "Mawlynnong+Meghalaya",
        rates: { stay: 1050, food: 600, transport: 700, activity: 400 },
        highlights: [
            "Jingmaham Single Living Root Bridge in neighboring Riwai",
            "Sky Walk 85-foot bamboo canopy watchtower",
            "Natural Balancing Rock geological phenomenon",
            "Dawki Umngot river crystal boating excursion (~30 km)"
        ]
    },
    chopta: {
        id: "chopta",
        name: "Chopta",
        state: "Uttarakhand",
        category: "mountains",
        tag: "Mini Switzerland of India",
        image: "images/chopta.jpg",
        description: "An untouched alpine meadow (Bugyal) in the Garhwal Himalayas enveloped by dense pine, deodar, and rhododendron forests. Serves as the starting base for trekking to Tungnath (highest Shiva temple) and Chandrashila Summit.",
        bestTime: "April to June (Spring flora) & Sept to Nov (Crisp peaks)",
        dailyRateText: "₹1,800 - ₹2,700 / day",
        airport: "Jolly Grant Airport, Dehradun (DED, ~215 km)",
        airportQuery: "Jolly+Grant+Airport+Dehradun",
        railway: "Rishikesh (YNRK, ~195 km) / Haridwar Junction (HW)",
        railwayQuery: "Haridwar+Railway+Station",
        mapQuery: "Chopta+Uttarakhand",
        rates: { stay: 1000, food: 600, transport: 750, activity: 450 },
        highlights: [
            "Tungnath Temple trek (world's highest Shiva shrine)",
            "Chandrashila Peak 360° summit views (Nanda Devi, Trishul)",
            "Serene Deoria Tal glacial lake forest walk",
            "Stargazing and eco-camping in pristine alpine meadows"
        ]
    },
    orchha: {
        id: "orchha",
        name: "Orchha",
        state: "Madhya Pradesh",
        category: "heritage",
        tag: "Bundela Royal Splendor",
        image: "images/orchha.jpg",
        description: "A frozen-in-time medieval capital situated along the rocky banks of the Betwa River. Famous for dramatic 16th-century Bundela Rajput architecture, palace fortresses, grand riverside cenotaphs, and ancient murals.",
        bestTime: "October to March",
        dailyRateText: "₹1,500 - ₹2,400 / day",
        airport: "Gwalior Airport (GWL, ~125 km) / Khajuraho (HJR, ~170 km)",
        airportQuery: "Gwalior+Airport",
        railway: "Virangana Lakshmibai Jhansi Junction (VGLJ, ~18 km)",
        railwayQuery: "Virangana+Lakshmibai+Jhansi+Junction",
        mapQuery: "Orchha+Madhya+Pradesh",
        rates: { stay: 900, food: 550, transport: 400, activity: 400 },
        highlights: [
            "Jahangir Mahal & Raja Mahal intricate fresco paintings",
            "14 royal memorial Chhatris reflecting on the Betwa River",
            "Ram Raja Temple (where Lord Rama is revered as king)",
            "Peaceful river rafting / sunset views along Betwa boulders"
        ]
    },
    dhanushkodi: {
        id: "dhanushkodi",
        name: "Dhanushkodi",
        state: "Tamil Nadu",
        category: "coastal",
        tag: "Mystical Edge of India",
        image: "images/dhanushkodi.jpg",
        description: "An evocative ghost town on the southeastern tip of Pamban Island, bordered by the turbulent Bay of Bengal on one side and the calm Indian Ocean on the other, at the geographical starting point of Rama Setu.",
        bestTime: "October to March",
        dailyRateText: "₹1,600 - ₹2,500 / day",
        airport: "Madurai International Airport (IXM, ~195 km)",
        airportQuery: "Madurai+Airport",
        railway: "Rameswaram Railway Station (RMM, ~20 km)",
        railwayQuery: "Rameswaram+Railway+Station",
        mapQuery: "Dhanushkodi+Tamil+Nadu",
        rates: { stay: 950, food: 600, transport: 550, activity: 350 },
        highlights: [
            "Submerged 1964 cyclone ruins (Church, Railway Station)",
            "Rama Setu (Adam's Bridge) point & two-ocean confluence",
            "Pamban sea rail bridge crossing experience",
            "Pristine white sandbars and flamingo birdwatching"
        ]
    }
};

// ==================== 2. DOM ELEMENTS ====================
const header = document.getElementById("header");
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-link");

const destinationsGrid = document.getElementById("destinationsGrid");
const filterButtons = document.querySelectorAll(".filter-btn");

// Modal elements
const destinationModal = document.getElementById("destinationModal");
const modalCloseBtn = document.getElementById("modalCloseBtn");
const modalImg = document.getElementById("modalImg");
const modalCategory = document.getElementById("modalCategory");
const modalState = document.getElementById("modalState");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalBestTime = document.getElementById("modalBestTime");
const modalDailyRate = document.getElementById("modalDailyRate");
const modalAirport = document.getElementById("modalAirport");
const modalRailway = document.getElementById("modalRailway");
const modalHighlights = document.getElementById("modalHighlights");
const modalBtnPlanHere = document.getElementById("modalBtnPlanHere");

// Planner form elements
const tripPlannerForm = document.getElementById("tripPlannerForm");
const destinationSelect = document.getElementById("destinationSelect");
const tripDays = document.getElementById("tripDays");
const budgetPerPerson = document.getElementById("budgetPerPerson");
const numTravellers = document.getElementById("numTravellers");
const travelPreference = document.getElementById("travelPreference");
const btnSubmitPlan = document.getElementById("btnSubmitPlan");
const formErrorMsg = document.getElementById("formErrorMsg");

// Planner results elements
const resultsEmptyState = document.getElementById("resultsEmptyState");
const resultsContent = document.getElementById("resultsContent");
const planDestState = document.getElementById("planDestState");
const planDestTitle = document.getElementById("planDestTitle");
const planMetaText = document.getElementById("planMetaText");
const planStatusPill = document.getElementById("planStatusPill");
const feasibilityAlert = document.getElementById("feasibilityAlert");

const valPerPerson = document.getElementById("valPerPerson");
const subPerPerson = document.getElementById("subPerPerson");
const valDailyCost = document.getElementById("valDailyCost");
const valGroupTotal = document.getElementById("valGroupTotal");
const subGroupTravellers = document.getElementById("subGroupTravellers");
const valGroupBudget = document.getElementById("valGroupBudget");
const subBudgetDiff = document.getElementById("subBudgetDiff");

const catAccomCost = document.getElementById("catAccomCost");
const catAccomBar = document.getElementById("catAccomBar");
const catFoodCost = document.getElementById("catFoodCost");
const catFoodBar = document.getElementById("catFoodBar");
const catTransportCost = document.getElementById("catTransportCost");
const catTransportBar = document.getElementById("catTransportBar");
const catActivityCost = document.getElementById("catActivityCost");
const catActivityBar = document.getElementById("catActivityBar");

const linkGoogleMaps = document.getElementById("linkGoogleMaps");
const txtMapsDest = document.getElementById("txtMapsDest");
const linkAirport = document.getElementById("linkAirport");
const txtAirport = document.getElementById("txtAirport");
const linkRailway = document.getElementById("linkRailway");
const txtRailway = document.getElementById("txtRailway");

const itineraryAccordion = document.getElementById("itineraryAccordion");

let currentModalDestination = null;

// ==================== 3. INITIALIZATION ====================
document.addEventListener("DOMContentLoaded", () => {
    // 1. Fetch live destinations from Flask API
    fetchDestinationsFromApi();

    // 2. Initialize UI modules
    initNavigation();
    initFilters();
    initModal();
    initPlannerForm();
});

// ==================== 4. FETCH DESTINATIONS FROM FLASK API ====================
async function fetchDestinationsFromApi() {
    try {
        const response = await fetch("/api/destinations");
        if (response.ok) {
            const result = await response.json();
            if (result.status === "success" && Array.isArray(result.destinations)) {
                // Map backend array to lookup dictionary
                const apiData = {};
                result.destinations.forEach(item => {
                    apiData[item.id] = {
                        id: item.id,
                        name: item.name,
                        state: item.state,
                        category: item.category,
                        tag: item.tag,
                        image: item.image,
                        description: item.description,
                        bestTime: item.best_time,
                        dailyRateText: item.daily_rate_text,
                        airport: item.airport,
                        airportQuery: item.airport_query,
                        railway: item.railway,
                        railwayQuery: item.railway_query,
                        mapQuery: item.map_query,
                        rates: item.rates,
                        highlights: item.highlights
                    };
                });
                DESTINATIONS_DATA = apiData;
            }
        }
    } catch (err) {
        console.warn("Flask API /api/destinations unreachable, using local fallback dataset:", err);
    } finally {
        // Render cards after dataset confirmed
        renderDestinations("all");
    }
}

// ==================== 5. DESTINATION CARDS & FILTERING ====================
function renderDestinations(category) {
    if (!destinationsGrid) return;
    destinationsGrid.innerHTML = "";

    const destinationKeys = Object.keys(DESTINATIONS_DATA);

    destinationKeys.forEach(key => {
        const dest = DESTINATIONS_DATA[key];

        // Match category
        if (category !== "all" && dest.category !== category) {
            // Secondary tag checks for multi-category matches
            if (category === "nature" && (key === "ziro" || key === "chopta")) {
                // Allow
            } else if (category === "heritage" && (key === "devprayag" || key === "orchha" || key === "dhanushkodi")) {
                // Allow
            } else {
                return;
            }
        }

        const card = document.createElement("div");
        card.className = "dest-card";
        card.innerHTML = `
            <div class="dest-card-media">
                <img src="${dest.image}" alt="${dest.name}" class="dest-card-img" loading="lazy">
                <span class="dest-card-badge">${dest.tag}</span>
                <span class="dest-card-state"><i class="fa-solid fa-location-dot"></i> ${dest.state}</span>
            </div>
            <div class="dest-card-body">
                <h3 class="dest-card-title">${dest.name}</h3>
                <p class="dest-card-desc">${dest.description}</p>
                <div class="dest-card-highlights">
                    <span class="dest-pill"><i class="fa-solid fa-star"></i> ${dest.highlights[0]}</span>
                    <span class="dest-pill"><i class="fa-solid fa-compass"></i> ${dest.highlights[1]}</span>
                </div>
                <div class="dest-card-footer">
                    <span class="dest-rate-tag">Est: <strong>${dest.dailyRateText}</strong></span>
                    <button class="btn btn-primary btn-sm btn-explore" data-id="${dest.id}">
                        <i class="fa-solid fa-arrow-right"></i> Explore
                    </button>
                </div>
            </div>
        `;

        destinationsGrid.appendChild(card);
    });

    // Attach click events to Explore buttons
    document.querySelectorAll(".btn-explore").forEach(btn => {
        btn.addEventListener("click", () => {
            const destId = btn.getAttribute("data-id");
            openDestinationModal(destId);
        });
    });
}

function initFilters() {
    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const category = btn.getAttribute("data-category");
            renderDestinations(category);
        });
    });
}

// ==================== 6. MODAL DIALOG CONTROLLER ====================
function openDestinationModal(destId) {
    const dest = DESTINATIONS_DATA[destId];
    if (!dest) return;

    currentModalDestination = destId;
    modalImg.src = dest.image;
    modalImg.alt = dest.name;
    modalCategory.textContent = dest.tag;
    modalState.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${dest.state}`;
    modalTitle.textContent = `${dest.name}, ${dest.state}`;
    modalDescription.textContent = dest.description;
    modalBestTime.textContent = dest.bestTime;
    modalDailyRate.textContent = dest.dailyRateText;
    modalAirport.textContent = dest.airport;
    modalRailway.textContent = dest.railway;

    // Highlights list
    modalHighlights.innerHTML = "";
    dest.highlights.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        modalHighlights.appendChild(li);
    });

    destinationModal.classList.add("show");
    destinationModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}

function closeDestinationModal() {
    destinationModal.classList.remove("show");
    destinationModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
}

function initModal() {
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener("click", closeDestinationModal);
    }

    if (destinationModal) {
        destinationModal.addEventListener("click", (e) => {
            if (e.target === destinationModal) {
                closeDestinationModal();
            }
        });
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && destinationModal.classList.contains("show")) {
            closeDestinationModal();
        }
    });

    // Auto-fill shortcut in planner
    if (modalBtnPlanHere) {
        modalBtnPlanHere.addEventListener("click", () => {
            if (currentModalDestination) {
                destinationSelect.value = currentModalDestination;
                closeDestinationModal();
                const plannerEl = document.getElementById("planner");
                if (plannerEl) {
                    plannerEl.scrollIntoView({ behavior: "smooth" });
                }
            }
        });
    }
}

// ==================== 7. NAVIGATION & SCROLL ====================
function initNavigation() {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 40) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
        updateActiveNavLink();
    });

    if (navToggle && navMenu) {
        navToggle.addEventListener("click", () => {
            navMenu.classList.toggle("open");
            const isOpen = navMenu.classList.contains("open");
            navToggle.innerHTML = isOpen ? `<i class="fa-solid fa-xmark"></i>` : `<i class="fa-solid fa-bars"></i>`;
        });
    }

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (navMenu.classList.contains("open")) {
                navMenu.classList.remove("open");
                navToggle.innerHTML = `<i class="fa-solid fa-bars"></i>`;
            }
        });
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll("section[id]");
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute("id");

        if (scrollPosition >= top && scrollPosition < top + height) {
            navLinks.forEach(link => {
                link.classList.remove("active");
                if (link.getAttribute("href") === `#${id}`) {
                    link.classList.add("active");
                }
            });
        }
    });
}

// ==================== 8. PLANNER FORM & BACKEND API CONNECT ====================
function initPlannerForm() {
    if (!tripPlannerForm) return;

    tripPlannerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Extract values
        const destKey = destinationSelect.value;
        const days = parseInt(tripDays.value, 10);
        const budget = parseInt(budgetPerPerson.value, 10);
        const travellers = parseInt(numTravellers.value, 10);
        const preference = travelPreference.value;

        // Reset error message
        formErrorMsg.style.display = "none";
        formErrorMsg.textContent = "";

        // Client-side quick validation
        if (!destKey) {
            showFormError("Please select a destination from the list.");
            return;
        }

        if (isNaN(days) || days < 1 || days > 14) {
            showFormError("Please enter valid travel days between 1 and 14.");
            return;
        }

        if (isNaN(budget) || budget < 1000) {
            showFormError("Please enter a realistic total budget per person (minimum ₹1,000).");
            return;
        }

        if (isNaN(travellers) || travellers < 1 || travellers > 20) {
            showFormError("Please enter a valid number of travellers (between 1 and 20).");
            return;
        }

        // Show loading state
        setSubmitButtonLoading(true);

        try {
            // POST request to Flask Backend API
            const response = await fetch("/api/plan-trip", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    destination: destKey,
                    days: days,
                    budget_per_person: budget,
                    travellers: travellers,
                    preference: preference
                })
            });

            const result = await response.json();

            if (response.ok && result.status === "success" && result.data) {
                // Successfully received plan from Flask backend
                displayTripPlanFromApi(result.data);
            } else {
                // Validation error returned by Flask API
                const errMsg = result.message || "Failed to generate trip plan. Please review inputs.";
                showFormError(errMsg);
            }
        } catch (error) {
            console.error("API call error:", error);
            // Graceful fallback: If Flask backend is temporarily offline, use internal engine
            showFormError("Connecting to Flask API failed. Running backup client engine...");
            const fallbackPlan = calculateFallbackPlan(destKey, days, budget, travellers, preference);
            if (fallbackPlan) {
                displayFallbackPlan(fallbackPlan);
            }
        } finally {
            setSubmitButtonLoading(false);
        }
    });
}

function setSubmitButtonLoading(isLoading) {
    if (!btnSubmitPlan) return;
    if (isLoading) {
        btnSubmitPlan.disabled = true;
        btnSubmitPlan.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Calculating Plan with Flask API...`;
    } else {
        btnSubmitPlan.disabled = false;
        btnSubmitPlan.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i> Generate Itinerary & Cost Plan`;
    }
}

function showFormError(msg) {
    if (formErrorMsg) {
        formErrorMsg.textContent = msg;
        formErrorMsg.style.display = "block";
    }
}

// ==================== 9. DISPLAY PLAN FROM FLASK API ====================
function displayTripPlanFromApi(apiData) {
    // Reveal results card
    resultsEmptyState.style.display = "none";
    resultsContent.style.display = "block";

    const dest = apiData.destination;
    const params = apiData.parameters;
    const budget = apiData.budget;
    const itinerary = apiData.itinerary;
    const transit = apiData.transit_links;

    // Header Info
    planDestState.textContent = dest.state;
    planDestTitle.textContent = `${dest.name}, ${dest.state}`;
    
    const prefLabel = preferenceDisplayLabel(params.preference);
    planMetaText.textContent = `${params.days} Days • ${params.travellers} ${params.travellers === 1 ? 'Traveller' : 'Travellers'} • ${prefLabel}`;

    // Feasibility Status Pill & Banner
    if (budget.is_sufficient) {
        planStatusPill.className = "plan-status-pill feasible";
        planStatusPill.innerHTML = `<i class="fa-solid fa-circle-check"></i> Budget Sufficient`;

        const surplus = budget.budget_difference;
        feasibilityAlert.className = "feasibility-alert success";
        feasibilityAlert.innerHTML = `
            <i class="fa-solid fa-circle-check"></i>
            <div>
                <strong>Budget Sufficient & Feasible:</strong> Your budget of <strong>₹${budget.user_budget_per_person.toLocaleString('en-IN')}</strong> per person comfortably covers the estimated trip cost of <strong>₹${budget.total_estimated_per_person.toLocaleString('en-IN')}</strong>. 
                <br>Estimated buffer: <strong>₹${surplus.toLocaleString('en-IN')}</strong> per person for personal shopping and incidental contingencies.
            </div>
        `;
    } else {
        planStatusPill.className = "plan-status-pill warning";
        planStatusPill.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Budget Warning`;

        const shortfall = Math.abs(budget.budget_difference);
        feasibilityAlert.className = "feasibility-alert warning";
        feasibilityAlert.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation"></i>
            <div>
                <strong>Budget Warning (Insufficient Funds):</strong> Your entered budget of <strong>₹${budget.user_budget_per_person.toLocaleString('en-IN')}</strong> is lower than the realistic baseline estimate of <strong>₹${budget.total_estimated_per_person.toLocaleString('en-IN')}</strong> per person. 
                <br>Shortfall: <strong>₹${shortfall.toLocaleString('en-IN')}</strong> per person. We recommend increasing your budget or shortening the trip duration.
            </div>
        `;
    }

    // 4 Summary Metrics Cards
    valPerPerson.textContent = `₹${budget.total_estimated_per_person.toLocaleString('en-IN')}`;
    subPerPerson.textContent = `Entered: ₹${budget.user_budget_per_person.toLocaleString('en-IN')}`;

    valDailyCost.textContent = `₹${budget.daily_estimated_per_person.toLocaleString('en-IN')}`;

    valGroupTotal.textContent = `₹${budget.total_estimated_group.toLocaleString('en-IN')}`;
    subGroupTravellers.textContent = `Total for ${params.travellers} ${params.travellers === 1 ? 'traveller' : 'travellers'}`;

    valGroupBudget.textContent = `₹${budget.total_budget_group.toLocaleString('en-IN')}`;
    if (budget.is_sufficient) {
        subBudgetDiff.textContent = `+₹${(budget.budget_difference * params.travellers).toLocaleString('en-IN')} remaining buffer`;
        subBudgetDiff.style.color = "var(--success)";
    } else {
        subBudgetDiff.textContent = `-₹${(Math.abs(budget.budget_difference) * params.travellers).toLocaleString('en-IN')} deficit`;
        subBudgetDiff.style.color = "var(--danger)";
    }

    // Category Expense Breakdown Bars
    const total = budget.total_estimated_per_person || 1;
    const pAccom = Math.round((budget.breakdown.accommodation / total) * 100);
    const pFood = Math.round((budget.breakdown.food / total) * 100);
    const pTrans = Math.round((budget.breakdown.transport / total) * 100);
    const pAct = Math.round((budget.breakdown.activity / total) * 100);

    catAccomCost.textContent = `₹${budget.breakdown.accommodation.toLocaleString('en-IN')} (${pAccom}%)`;
    catAccomBar.style.width = `${pAccom}%`;

    catFoodCost.textContent = `₹${budget.breakdown.food.toLocaleString('en-IN')} (${pFood}%)`;
    catFoodBar.style.width = `${pFood}%`;

    catTransportCost.textContent = `₹${budget.breakdown.transport.toLocaleString('en-IN')} (${pTrans}%)`;
    catTransportBar.style.width = `${pTrans}%`;

    catActivityCost.textContent = `₹${budget.breakdown.activity.toLocaleString('en-IN')} (${pAct}%)`;
    catActivityBar.style.width = `${pAct}%`;

    // Google Maps Navigation Links
    linkGoogleMaps.href = transit.destination_map_url;
    txtMapsDest.textContent = transit.destination_label;

    linkAirport.href = transit.airport_map_url;
    txtAirport.textContent = transit.airport_name;

    linkRailway.href = transit.railway_map_url;
    txtRailway.textContent = transit.railway_name;

    // Render Expandable Day-Wise Itinerary Accordion
    renderItineraryAccordion(itinerary);

    // Smooth scroll down on smaller screens
    if (window.innerWidth < 900) {
        resultsContent.scrollIntoView({ behavior: "smooth" });
    }
}

function preferenceDisplayLabel(pref) {
    switch (pref) {
        case "adventure": return "Adventure & Trekking";
        case "cultural": return "Cultural & Heritage";
        case "relaxation": return "Relaxation & Serenity";
        case "nature": return "Nature & Scenic Trails";
        default: return "Custom Tour";
    }
}

// ==================== 10. ACCORDION COMPONENT ====================
function renderItineraryAccordion(itinerary) {
    if (!itineraryAccordion) return;
    itineraryAccordion.innerHTML = "";

    itinerary.forEach((item, index) => {
        const isOpen = index === 0; // First day expanded by default

        const accItem = document.createElement("div");
        accItem.className = `accordion-item ${isOpen ? 'active' : ''}`;
        
        accItem.innerHTML = `
            <button type="button" class="accordion-header" aria-expanded="${isOpen}">
                <div class="accordion-header-left">
                    <span class="day-badge">Day ${item.day}</span>
                    <span class="day-theme-title">${item.theme}</span>
                </div>
                <i class="fa-solid fa-chevron-down accordion-icon"></i>
            </button>
            <div class="accordion-content">
                <div class="day-timeline">
                    <div class="timeline-slot">
                        <span class="slot-time"><i class="fa-solid fa-sun"></i> Morning</span>
                        <h5 class="slot-title">Kickstart & Exploration</h5>
                        <p class="slot-desc">${item.morning}</p>
                    </div>
                    <div class="timeline-slot">
                        <span class="slot-time"><i class="fa-solid fa-cloud-sun"></i> Afternoon</span>
                        <h5 class="slot-title">Immersion & Regional Flavors</h5>
                        <p class="slot-desc">${item.afternoon}</p>
                    </div>
                    <div class="timeline-slot">
                        <span class="slot-time"><i class="fa-solid fa-moon"></i> Evening</span>
                        <h5 class="slot-title">Sunset & Cultural Unwinding</h5>
                        <p class="slot-desc">${item.evening}</p>
                    </div>
                </div>
                <div class="day-pro-tip">
                    <i class="fa-solid fa-lightbulb"></i>
                    <span><strong>Pro-Tip:</strong> ${item.tip}</span>
                </div>
            </div>
        `;

        itineraryAccordion.appendChild(accItem);

        // Header click toggle
        const headerBtn = accItem.querySelector(".accordion-header");
        headerBtn.addEventListener("click", () => {
            const isActive = accItem.classList.contains("active");
            
            // Accordion behavior: close other panels
            document.querySelectorAll(".accordion-item").forEach(other => {
                if (other !== accItem) other.classList.remove("active");
            });

            accItem.classList.toggle("active", !isActive);
            headerBtn.setAttribute("aria-expanded", !isActive);
        });
    });
}

// ==================== 11. FALLBACK ENGINE (OFFLINE CONTINGENCY) ====================
function calculateFallbackPlan(destKey, days, budget, travellers, preference) {
    const dest = DESTINATIONS_DATA[destKey];
    if (!dest) return null;

    const mults = {
        adventure: { stay: 1.0, food: 1.05, transport: 1.15, activity: 1.25 },
        cultural: { stay: 1.05, food: 1.0, transport: 1.0, activity: 1.20 },
        relaxation: { stay: 1.20, food: 1.15, transport: 1.05, activity: 0.90 },
        nature: { stay: 1.0, food: 1.0, transport: 1.05, activity: 1.05 }
    };
    const m = mults[preference] || mults.nature;

    const roomRate = Math.round(dest.rates.stay * 1.6 * m.stay);
    const numRooms = Math.ceil(travellers / 2);
    const lodgingTotal = roomRate * numRooms * Math.max(1, days - 1);
    const lodgingPP = Math.round(lodgingTotal / travellers);

    const foodPP = Math.round(dest.rates.food * m.food) * days;
    const baseCab = Math.round(dest.rates.transport * 2.2 * m.transport);
    const transTotal = baseCab * Math.ceil(travellers / 4) * days;
    const transPP = Math.round(transTotal / travellers);
    const actPP = Math.round(dest.rates.activity * m.activity) * days;

    const estPP = lodgingPP + foodPP + transPP + actPP;

    return {
        destination: {
            id: dest.id,
            name: dest.name,
            state: dest.state,
            category: dest.category,
            tag: dest.tag,
            image: dest.image,
            description: dest.description,
            best_time: dest.bestTime,
            daily_rate_text: dest.dailyRateText,
            airport: dest.airport,
            railway: dest.railway
        },
        parameters: { days, travellers, preference, user_budget_per_person: budget },
        budget: {
            user_budget_per_person: budget,
            total_budget_group: budget * travellers,
            total_estimated_per_person: estPP,
            daily_estimated_per_person: Math.round(estPP / days),
            total_estimated_group: estPP * travellers,
            budget_difference: budget - estPP,
            is_sufficient: budget >= estPP,
            breakdown: { accommodation: lodgingPP, food: foodPP, transport: transPP, activity: actPP }
        },
        itinerary: [
            {
                day: 1,
                theme: `Day 1: Arrival & Exploration`,
                morning: `Check into local guesthouse in ${dest.name} and refresh.`,
                afternoon: `Orientation walk and local regional lunch.`,
                evening: `Sunset views and evening briefing.`,
                tip: `Keep local cash handy.`
            }
        ],
        transit_links: {
            destination_map_url: `https://www.google.com/maps/search/?api=1&query=${dest.mapQuery}`,
            destination_label: `${dest.name}, ${dest.state}`,
            airport_name: dest.airport,
            airport_map_url: `https://www.google.com/maps/search/?api=1&query=${dest.airportQuery}`,
            railway_name: dest.railway,
            railway_map_url: `https://www.google.com/maps/search/?api=1&query=${dest.railwayQuery}`
        }
    };
}

function displayFallbackPlan(plan) {
    displayTripPlanFromApi(plan);
}
