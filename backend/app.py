"""
=============================================================================
TripCraft — Travel Planning Web Application Backend
BCA 5th Semester Web Application Development Project
=============================================================================

Technology: Python 3 with Flask
Architecture:
- Serves the frontend directly from ../frontend
- REST API Endpoints:
  * GET  /api/destinations  -> List all 9 curated Indian destinations
  * POST /api/plan-trip     -> Validate parameters & calculate custom itinerary + budget
"""

import os
import math
from flask import Flask, jsonify, request, send_from_directory, abort

# ==================== DIRECTORY CONFIGURATION ====================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "frontend"))

app = Flask(__name__, static_folder=FRONTEND_DIR, static_url_path="")

# ==================== DESTINATIONS DATABASE (IN-MEMORY) ====================
# Realistic baseline rates per person/day in INR (excluding long-distance flights/trains)
DESTINATIONS = {
    "ziro": {
        "id": "ziro",
        "name": "Ziro Valley",
        "state": "Arunachal Pradesh",
        "category": "mountains",
        "tag": "Apatani Cultural Haven",
        "image": "images/ziro.jpg",
        "description": "A tranquil valley cradled by pine-clad hills and emerald paddy terraces, home to the indigenous Apatani tribe known for sustainable farming, traditional wooden bamboo houses, and the famed Ziro Music Festival.",
        "best_time": "March to October (Ziro Festival in late Sept)",
        "daily_rate_text": "₹1,800 - ₹2,600 / day",
        "airport": "Donyi Polo Airport, Itanagar (HGI, ~100 km) / Lilabari (IXI)",
        "airport_query": "Donyi+Polo+Airport+Itanagar",
        "railway": "Naharlagun Railway Station (NHN, ~95 km)",
        "railway_query": "Naharlagun+Railway+Station",
        "map_query": "Ziro+Valley+Arunachal+Pradesh",
        "rates": {"stay": 1000, "food": 650, "transport": 600, "activity": 400},
        "highlights": [
            "Apatani tribal villages (Hong, Hari, Hija)",
            "Tarin High-Altitude Fish Farm & Pine Groves",
            "Kardo Shiva Lingam (natural rock formation)",
            "Local organic kiwi orchards & rice beer tasting"
        ]
    },
    "tawang": {
        "id": "tawang",
        "name": "Tawang",
        "state": "Arunachal Pradesh",
        "category": "mountains",
        "tag": "Monasteries & High Passes",
        "image": "images/tawang.jpg",
        "description": "Perched at an elevation of 10,000 feet near the Indo-Bhutan border, Tawang is renowned for India's largest Buddhist monastery founded in 1681, breathtaking high-altitude mountain passes, and crystal glacial lakes.",
        "best_time": "March to June & September to November",
        "daily_rate_text": "₹2,200 - ₹3,200 / day",
        "airport": "Tezpur Airport (TEZ, ~320 km) / Guwahati (GAU, ~440 km)",
        "airport_query": "Tezpur+Airport",
        "railway": "Rangapara North Railway Station (~315 km)",
        "railway_query": "Rangapara+North+Railway+Station",
        "map_query": "Tawang+Arunachal+Pradesh",
        "rates": {"stay": 1200, "food": 750, "transport": 950, "activity": 500},
        "highlights": [
            "Tawang Monastery (Ganden Namgyal Lhatse)",
            "Sela Pass & frozen Sela Lake (13,700 ft)",
            "Madhuri Lake (Sangetsar Tso) mountain bowl",
            "Nuranang Falls (Bap Teng Kang) cascade"
        ]
    },
    "majuli": {
        "id": "majuli",
        "name": "Majuli Island",
        "state": "Assam",
        "category": "coastal",
        "tag": "World's Largest River Island",
        "image": "images/majuli.jpg",
        "description": "Formed by the mighty Brahmaputra River, Majuli is the world's largest inhabited river island and the heart of Assamese Neo-Vaishnavite culture, renowned for ancient Satras, traditional mask making, and peaceful riverbank life.",
        "best_time": "October to March",
        "daily_rate_text": "₹1,500 - ₹2,300 / day",
        "airport": "Jorhat Airport / Rowriah (JRH, ~20 km + Nimati Ghat ferry)",
        "airport_query": "Jorhat+Airport+Rowriah",
        "railway": "Jorhat Town Railway Station (JTTN, ~18 km)",
        "railway_query": "Jorhat+Town+Railway+Station",
        "map_query": "Majuli+Island+Assam",
        "rates": {"stay": 850, "food": 550, "transport": 450, "activity": 350},
        "highlights": [
            "Kamalabari & Auniati Neo-Vaishnavite Satras",
            "Traditional Mukha mask-making at Natun Samaguri",
            "Scenic Brahmaputra sunset ferry crossing",
            "Mishing tribal village hospitality and pottery"
        ]
    },
    "gokarna": {
        "id": "gokarna",
        "name": "Gokarna",
        "state": "Karnataka",
        "category": "coastal",
        "tag": "Pristine Arabian Coast",
        "image": "images/gokarna.jpg",
        "description": "A tranquil temple town bordered by rugged Western Ghats cliffs and untouched crescent beaches. Offers serene beach treks, golden sands, and cliffside sunsets without the chaotic crowds of mainstream beach destinations.",
        "best_time": "October to March",
        "daily_rate_text": "₹1,600 - ₹2,500 / day",
        "airport": "Goa Dabolim Airport (GOI, ~140 km) / Mopa (GOX)",
        "airport_query": "Goa+International+Airport+Dabolim",
        "railway": "Gokarna Road Railway Station (GOK, ~9 km)",
        "railway_query": "Gokarna+Road+Railway+Station",
        "map_query": "Gokarna+Karnataka",
        "rates": {"stay": 950, "food": 650, "transport": 450, "activity": 350},
        "highlights": [
            "Om Beach, Kudle Beach & Half Moon Beach cliff trek",
            "Ancient Mahabaleshwar Temple & Kotitirtha sacred pond",
            "Cliffside yoga and peaceful Arabian sea sunset views",
            "Historic Mirjan Fort day trip"
        ]
    },
    "devprayag": {
        "id": "devprayag",
        "name": "Devprayag",
        "state": "Uttarakhand",
        "category": "heritage",
        "tag": "Sacred Holy Confluence",
        "image": "images/devprayag.jpg",
        "description": "The mystical mountain town where the gushing turquoise Bhagirathi river meets the calm, silvery Alaknanda river to form the holy River Ganga. Perched dramatically between steep Himalayan river cliffs.",
        "best_time": "Year-Round (Pleasant Oct to April)",
        "daily_rate_text": "₹1,400 - ₹2,200 / day",
        "airport": "Jolly Grant Airport, Dehradun (DED, ~90 km)",
        "airport_query": "Jolly+Grant+Airport+Dehradun",
        "railway": "Yog Nagari Rishikesh Railway Station (YNRK, ~70 km)",
        "railway_query": "Yog+Nagari+Rishikesh+Railway+Station",
        "map_query": "Devprayag+Uttarakhand",
        "rates": {"stay": 800, "food": 500, "transport": 450, "activity": 300},
        "highlights": [
            "Confluence (Sangam) of Bhagirathi and Alaknanda",
            "1000-year-old Raghunathji Temple stone architecture",
            "Dramatic pedestrian suspension bridges over the river gorge",
            "Evening riverside aarti along the holy ghats"
        ]
    },
    "mawlynnong": {
        "id": "mawlynnong",
        "name": "Mawlynnong",
        "state": "Meghalaya",
        "category": "nature",
        "tag": "Asia's Cleanest Eco-Village",
        "image": "images/mawlynnong.jpg",
        "description": "Renowned as 'God's Own Garden', this eco-conscious Khasi tribal village maintains 100% cleanliness with bamboo waste bins, flowering pathways, nearby bio-engineered living root bridges, and views overlooking Bangladesh.",
        "best_time": "September to May (Lush post-monsoon greenery)",
        "daily_rate_text": "₹1,700 - ₹2,600 / day",
        "airport": "Shillong Airport, Umroi (SHL, ~90 km) / Guwahati (GAU)",
        "airport_query": "Shillong+Airport+Umroi",
        "railway": "Guwahati Railway Station (GHY, ~170 km)",
        "railway_query": "Guwahati+Railway+Station",
        "map_query": "Mawlynnong+Meghalaya",
        "rates": {"stay": 1050, "food": 600, "transport": 700, "activity": 400},
        "highlights": [
            "Jingmaham Single Living Root Bridge in neighboring Riwai",
            "Sky Walk 85-foot bamboo canopy watchtower",
            "Natural Balancing Rock geological phenomenon",
            "Dawki Umngot river crystal boating excursion (~30 km)"
        ]
    },
    "chopta": {
        "id": "chopta",
        "name": "Chopta",
        "state": "Uttarakhand",
        "category": "mountains",
        "tag": "Mini Switzerland of India",
        "image": "images/chopta.jpg",
        "description": "An untouched alpine meadow (Bugyal) in the Garhwal Himalayas enveloped by dense pine, deodar, and rhododendron forests. Serves as the starting base for trekking to Tungnath (highest Shiva temple) and Chandrashila Summit.",
        "best_time": "April to June (Spring flora) & Sept to Nov (Crisp peaks)",
        "daily_rate_text": "₹1,800 - ₹2,700 / day",
        "airport": "Jolly Grant Airport, Dehradun (DED, ~215 km)",
        "airport_query": "Jolly+Grant+Airport+Dehradun",
        "railway": "Rishikesh (YNRK, ~195 km) / Haridwar Junction (HW)",
        "railway_query": "Haridwar+Railway+Station",
        "map_query": "Chopta+Uttarakhand",
        "rates": {"stay": 1000, "food": 600, "transport": 750, "activity": 450},
        "highlights": [
            "Tungnath Temple trek (world's highest Shiva shrine)",
            "Chandrashila Peak 360° summit views (Nanda Devi, Trishul)",
            "Serene Deoria Tal glacial lake forest walk",
            "Stargazing and eco-camping in pristine alpine meadows"
        ]
    },
    "orchha": {
        "id": "orchha",
        "name": "Orchha",
        "state": "Madhya Pradesh",
        "category": "heritage",
        "tag": "Bundela Royal Splendor",
        "image": "images/orchha.jpg",
        "description": "A frozen-in-time medieval capital situated along the rocky banks of the Betwa River. Famous for dramatic 16th-century Bundela Rajput architecture, palace fortresses, grand riverside cenotaphs, and ancient murals.",
        "best_time": "October to March",
        "daily_rate_text": "₹1,500 - ₹2,400 / day",
        "airport": "Gwalior Airport (GWL, ~125 km) / Khajuraho (HJR, ~170 km)",
        "airport_query": "Gwalior+Airport",
        "railway": "Virangana Lakshmibai Jhansi Junction (VGLJ, ~18 km)",
        "railway_query": "Virangana+Lakshmibai+Jhansi+Junction",
        "map_query": "Orchha+Madhya+Pradesh",
        "rates": {"stay": 900, "food": 550, "transport": 400, "activity": 400},
        "highlights": [
            "Jahangir Mahal & Raja Mahal intricate fresco paintings",
            "14 royal memorial Chhatris reflecting on the Betwa River",
            "Ram Raja Temple (where Lord Rama is revered as king)",
            "Peaceful river rafting / sunset views along Betwa boulders"
        ]
    },
    "dhanushkodi": {
        "id": "dhanushkodi",
        "name": "Dhanushkodi",
        "state": "Tamil Nadu",
        "category": "coastal",
        "tag": "Mystical Edge of India",
        "image": "images/dhanushkodi.jpg",
        "description": "An evocative ghost town on the southeastern tip of Pamban Island, bordered by the turbulent Bay of Bengal on one side and the calm Indian Ocean on the other, at the geographical starting point of Rama Setu.",
        "best_time": "October to March",
        "daily_rate_text": "₹1,600 - ₹2,500 / day",
        "airport": "Madurai International Airport (IXM, ~195 km)",
        "airport_query": "Madurai+Airport",
        "railway": "Rameswaram Railway Station (RMM, ~20 km)",
        "railway_query": "Rameswaram+Railway+Station",
        "map_query": "Dhanushkodi+Tamil+Nadu",
        "rates": {"stay": 950, "food": 600, "transport": 550, "activity": 350},
        "highlights": [
            "Submerged 1964 cyclone ruins (Church, Railway Station)",
            "Rama Setu (Adam's Bridge) point & two-ocean confluence",
            "Pamban sea rail bridge crossing experience",
            "Pristine white sandbars and flamingo birdwatching"
        ]
    }
}

# ==================== TRAVEL PREFERENCE MULTIPLIERS ====================
PREFERENCE_MULTIPLIERS = {
    "adventure": {"stay": 1.0, "food": 1.05, "transport": 1.15, "activity": 1.25},
    "cultural": {"stay": 1.05, "food": 1.0, "transport": 1.0, "activity": 1.20},
    "relaxation": {"stay": 1.20, "food": 1.15, "transport": 1.05, "activity": 0.90},
    "nature": {"stay": 1.0, "food": 1.0, "transport": 1.05, "activity": 1.05}
}

PREFERENCE_TITLES = {
    "adventure": [
        "Arrival & Trail Scouting",
        "Trek to High Ridge",
        "Wilderness Exploration",
        "River Crossing & Summit",
        "Valley Adventure & Descent"
    ],
    "cultural": [
        "Arrival & Heritage Walk",
        "Monastery & Artisan Satra Tour",
        "Village Folk Tradition",
        "Ancient Temple Legends",
        "Local Market & Crafts"
    ],
    "relaxation": [
        "Check-in & Scenic Stroll",
        "Riverside Peace & Cafe Chill",
        "Panoramic Sunset Viewing",
        "Slow Nature Walk",
        "Unwinding & Departure"
    ],
    "nature": [
        "Arrival & Green Valley Walk",
        "Forest Sanctuary Trail",
        "Living Root & Waterfall Trek",
        "Sunrise Peak Vista",
        "Eco-Village Farewell"
    ]
}

# ==================== BUDGET CALCULATION ENGINE ====================
def calculate_trip_budget(dest_key, days, user_budget_per_person, travellers, preference):
    """
    Calculates itemized realistic trip estimates based on destination,
    group size sharing, and travel preference multiplier.
    """
    dest = DESTINATIONS[dest_key]
    multiplier = PREFERENCE_MULTIPLIERS.get(preference, {"stay": 1.0, "food": 1.0, "transport": 1.0, "activity": 1.0})

    # Accommodation: twin-sharing basis (rooms = ceil(travellers / 2))
    # 1 room for 2 people costs approx 1.6x single stay baseline
    room_rate_per_night = round(dest["rates"]["stay"] * 1.6 * multiplier["stay"])
    num_rooms = math.ceil(travellers / 2)
    nights = max(1, days - 1)
    total_lodging_group = room_rate_per_night * num_rooms * nights
    lodging_per_person = round(total_lodging_group / travellers)

    # Food: Per-person daily meals
    daily_food_per_person = round(dest["rates"]["food"] * multiplier["food"])
    total_food_per_person = daily_food_per_person * days

    # Local Transport: Shared cab or auto pool (1 cab per 4 travellers)
    base_daily_cab_rate = round(dest["rates"]["transport"] * 2.2 * multiplier["transport"])
    num_vehicles = math.ceil(travellers / 4)
    total_transport_group = base_daily_cab_rate * num_vehicles * days
    transport_per_person = round(total_transport_group / travellers)

    # Sightseeing & Activities: Per-person tickets, local permits, guide fees
    daily_activity_per_person = round(dest["rates"]["activity"] * multiplier["activity"])
    total_activity_per_person = daily_activity_per_person * days

    # Aggregate Totals
    total_estimated_per_person = lodging_per_person + total_food_per_person + transport_per_person + total_activity_per_person
    daily_estimated_per_person = round(total_estimated_per_person / days)

    total_estimated_group = total_estimated_per_person * travellers
    total_budget_group = user_budget_per_person * travellers
    budget_difference = user_budget_per_person - total_estimated_per_person
    is_sufficient = budget_difference >= 0

    return {
        "user_budget_per_person": user_budget_per_person,
        "total_budget_group": total_budget_group,
        "total_estimated_per_person": total_estimated_per_person,
        "daily_estimated_per_person": daily_estimated_per_person,
        "total_estimated_group": total_estimated_group,
        "budget_difference": budget_difference,
        "is_sufficient": is_sufficient,
        "breakdown": {
            "accommodation": lodging_per_person,
            "food": total_food_per_person,
            "transport": transport_per_person,
            "activity": total_activity_per_person
        }
    }

# ==================== DAY-WISE ITINERARY ENGINE ====================
def generate_day_wise_itinerary(dest_key, days, preference):
    """
    Generates tailored, realistic day-by-day itineraries
    with morning, afternoon, evening activities and practical pro-tips.
    """
    dest = DESTINATIONS[dest_key]
    pool = dest["highlights"]
    titles = PREFERENCE_TITLES.get(preference, PREFERENCE_TITLES["nature"])

    schedule = []
    for day_num in range(1, days + 1):
        title_idx = (day_num - 1) % len(titles)
        main_highlight = pool[(day_num - 1) % len(pool)]

        if day_num == 1:
            morning = f"Arrival at {dest['name']} base. Check into your local guesthouse or homestay, freshen up, and enjoy a traditional welcome refreshment."
            afternoon = "Gentle orientation walk around the neighborhood. Explore local alleys and sample authentic regional lunch at an indigenous eatery."
            evening = "Witness a serene sunset overlooking the surrounding landscapes. Evening briefing on local customs and permits."
            tip = "Keep small cash currency handy; remote Himalayan and island spots have limited digital POS terminals."
        elif day_num == days:
            morning = f"Early sunrise excursion to catch the golden morning light over {dest['name']}. Capture final scenic photography."
            afternoon = "Visit the local artisans market. Pick up authentic indigenous handlooms, organic honey, or handcrafted souvenirs."
            evening = f"Pack luggage, settle homestay accounts, and initiate return transfer toward {dest['railway']} or {dest['airport']}."
            tip = "Start transit at least 4 hours before scheduled departure due to winding mountain roads or ferry timetables."
        else:
            morning = f"Guided morning expedition: Experience <strong>{main_highlight}</strong>. Best visited early to enjoy calm weather and avoid midday heat."
            afternoon = "Traditional communal lunch with locals. In-depth exploration of historic spots, bamboo trails, or peaceful riverfront sights."
            evening = "Relax at a local mountain cafe or riverside viewpoint. Enjoy authentic herbal tea or regional snacks while stargazing."
            tip = "Carry a refillable water bottle and wear comfortable, sturdy walking shoes for stone steps and uneven terrain."

        schedule.append({
            "day": day_num,
            "theme": f"Day {day_num}: {titles[title_idx]}",
            "morning": morning,
            "afternoon": afternoon,
            "evening": evening,
            "tip": tip
        })

    return schedule

# ==================== FRONTEND STATIC SERVING ROUTES ====================
@app.route("/")
def serve_index():
    """Serves the main single page web application."""
    return send_from_directory(FRONTEND_DIR, "index.html")

@app.route("/<path:path>")
def serve_static(path):
    """Serves frontend static assets (CSS, JS, images)."""
    full_path = os.path.join(FRONTEND_DIR, path)
    if os.path.exists(full_path):
        return send_from_directory(FRONTEND_DIR, path)
    abort(404)

# ==================== REST API ENDPOINTS ====================
@app.route("/api/destinations", methods=["GET"])
def get_destinations():
    """
    Returns list of all 9 curated Indian destinations with metadata.
    """
    dest_list = list(DESTINATIONS.values())
    return jsonify({
        "status": "success",
        "count": len(dest_list),
        "destinations": dest_list
    }), 200

@app.route("/api/plan-trip", methods=["POST"])
def plan_trip():
    """
    Validates input parameters and returns a complete, destination-based
    budget analysis and day-wise itinerary.
    """
    # 1. Parse JSON body
    if not request.is_json:
        return jsonify({
            "status": "error",
            "message": "Invalid request: Expected Content-Type application/json."
        }), 400

    data = request.get_json()
    if not data:
        return jsonify({
            "status": "error",
            "message": "Empty request body provided."
        }), 400

    # 2. Extract fields
    dest_key = data.get("destination")
    days_raw = data.get("days")
    budget_raw = data.get("budget_per_person")
    travellers_raw = data.get("travellers")
    preference = data.get("preference", "nature")

    # 3. Validate Destination
    if not dest_key or not isinstance(dest_key, str):
        return jsonify({
            "status": "error",
            "message": "Destination is required and must be a valid key."
        }), 400

    dest_key = dest_key.strip().lower()
    if dest_key not in DESTINATIONS:
        return jsonify({
            "status": "error",
            "message": f"Unknown destination '{dest_key}'. Must be one of: {', '.join(DESTINATIONS.keys())}."
        }), 400

    # 4. Validate Travel Days (1 to 14)
    try:
        days = int(days_raw)
    except (TypeError, ValueError):
        return jsonify({
            "status": "error",
            "message": "Days must be an integer between 1 and 14."
        }), 400

    if days < 1 or days > 14:
        return jsonify({
            "status": "error",
            "message": "Trip duration must be between 1 and 14 days."
        }), 400

    # 5. Validate Travellers (1 to 20)
    try:
        travellers = int(travellers_raw)
    except (TypeError, ValueError):
        return jsonify({
            "status": "error",
            "message": "Travellers count must be an integer between 1 and 20."
        }), 400

    if travellers < 1 or travellers > 20:
        return jsonify({
            "status": "error",
            "message": "Number of travellers must be between 1 and 20."
        }), 400

    # 6. Validate Budget per person (min 1,000 INR)
    try:
        budget_per_person = int(budget_raw)
    except (TypeError, ValueError):
        return jsonify({
            "status": "error",
            "message": "Budget per person must be a valid numeric figure in INR."
        }), 400

    if budget_per_person < 1000:
        return jsonify({
            "status": "error",
            "message": "Minimum budget per person must be at least ₹1,000 INR."
        }), 400

    # 7. Validate Travel Preference
    valid_preferences = ["adventure", "cultural", "relaxation", "nature"]
    preference = str(preference).strip().lower()
    if preference not in valid_preferences:
        preference = "nature"

    # 8. Compute Budget & Itinerary
    budget_result = calculate_trip_budget(dest_key, days, budget_per_person, travellers, preference)
    itinerary_result = generate_day_wise_itinerary(dest_key, days, preference)

    dest = DESTINATIONS[dest_key]

    # 9. Structured Response
    response_payload = {
        "status": "success",
        "data": {
            "destination": {
                "id": dest["id"],
                "name": dest["name"],
                "state": dest["state"],
                "category": dest["category"],
                "tag": dest["tag"],
                "image": dest["image"],
                "description": dest["description"],
                "best_time": dest["best_time"],
                "daily_rate_text": dest["daily_rate_text"],
                "airport": dest["airport"],
                "railway": dest["railway"]
            },
            "parameters": {
                "days": days,
                "travellers": travellers,
                "preference": preference,
                "user_budget_per_person": budget_per_person
            },
            "budget": budget_result,
            "itinerary": itinerary_result,
            "transit_links": {
                "destination_map_url": f"https://www.google.com/maps/search/?api=1&query={dest['map_query']}",
                "destination_label": f"{dest['name']}, {dest['state']}",
                "airport_name": dest["airport"],
                "airport_map_url": f"https://www.google.com/maps/search/?api=1&query={dest['airport_query']}",
                "railway_name": dest["railway"],
                "railway_map_url": f"https://www.google.com/maps/search/?api=1&query={dest['railway_query']}"
            },
            "disclaimer": "Academic Estimation Disclaimer: All financial figures and transport costs are realistic baseline estimates calculated for college project planning and educational reference. TripCraft does not claim live real-time pricing or live ticket booking."
        }
    }

    return jsonify(response_payload), 200

# ==================== MAIN EXECUTION ====================
if __name__ == "__main__":
    print("\n" + "=" * 65)
    print("  TripCraft — Travel Planning Web Application (Flask Server)")
    print("  Serving frontend directly from:", FRONTEND_DIR)
    print("  Local URL: http://127.0.0.1:5000/")
    print("=" * 65 + "\n")
    app.run(host="127.0.0.1", port=5000, debug=True)
