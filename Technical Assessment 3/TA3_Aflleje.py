import json
import math

class DisasterCBRSystem:
    def __init__(self):
        # 1. RETRIEVE STAGE / CASE BASE INITIALIZATION
        self.case_base = [
            {
                "case_id": "CBR-001",
                "name": "Typhoon Ursula (2019)",
                "disaster_type": "Typhoon",
                "area_type": "Urban",
                "population": 50000,
                "rainfall_mm": 220,
                "wind_speed_kmh": 150,
                "solution": {
                    "evacuation_strategy": "Mandatory vertical evacuation in high-rise shelters",
                    "resource_allocation": "2,000 food packs, 50 rescue boats, 10 mobile generators",
                    "shelter_capacity_needed": 12000
                }
            },
            {
                "case_id": "CBR-002",
                "name": "Typhoon Odette (2021)",
                "disaster_type": "Typhoon",
                "area_type": "Coastal",
                "population": 85000,
                "rainfall_mm": 350,
                "wind_speed_kmh": 260,
                "solution": {
                    "evacuation_strategy": "Preemptive inland coastal evacuation within 5km zone",
                    "resource_allocation": "5,000 food packs, 120 rescue boats, satellite communication units",
                    "shelter_capacity_needed": 25000
                }
            },
            {
                "case_id": "CBR-003",
                "name": "Tropical Storm Agaton (2022)",
                "disaster_type": "Flood",
                "area_type": "Rural",
                "population": 20000,
                "rainfall_mm": 400,
                "wind_speed_kmh": 75,
                "solution": {
                    "evacuation_strategy": "High-ground relocation due to landslide risks",
                    "resource_allocation": "1,000 food packs, 20 amphibian trucks, medical kits",
                    "shelter_capacity_needed": 6000
                }
            },
            {
                "case_id": "CBR-004",
                "name": "Typhoon Karding (2022)",
                "disaster_type": "Typhoon",
                "area_type": "Urban",
                "population": 110000,
                "rainfall_mm": 280,
                "wind_speed_kmh": 185,
                "solution": {
                    "evacuation_strategy": "City-wide preemptive evacuation and floodway gate opening",
                    "resource_allocation": "6,000 food packs, 80 rescue boats, heavy water pumps",
                    "shelter_capacity_needed": 30000
                }
            }
        ]

    # 2. SIMILARITY ASSESSMENT (Euclidean Distance & Feature Matching)
    def calculate_similarity(self, new_case, past_case):
        # Attribute matching scores
        type_match = 1.0 if new_case["disaster_type"].lower() == past_case["disaster_type"].lower() else 0.5
        area_match = 1.0 if new_case["area_type"].lower() == past_case["area_type"].lower() else 0.6

        # Normalized numerical feature distances
        pop_diff = abs(new_case["population"] - past_case["population"]) / max(new_case["population"], past_case["population"])
        rain_diff = abs(new_case["rainfall_mm"] - past_case["rainfall_mm"]) / max(new_case["rainfall_mm"], past_case["rainfall_mm"])
        wind_diff = abs(new_case["wind_speed_kmh"] - past_case["wind_speed_kmh"]) / max(new_case["wind_speed_kmh"], past_case["wind_speed_kmh"])

        numerical_score = 1.0 - ((pop_diff + rain_diff + wind_diff) / 3.0)
        
        # Weighted Total Similarity Score
        total_score = (type_match * 0.3) + (area_match * 0.2) + (numerical_score * 0.5)
        return round(total_score * 100, 2)

    def retrieve_best_case(self, new_case):
        best_case = None
        highest_score = -1.0

        print("\n--- [RETIREVE STAGE] Evaluating Past Cases ---")
        for case in self.case_base:
            score = self.calculate_similarity(new_case, case)
            print(f"Case ID: {case['case_id']} | Event: {case['name']:<28} | Similarity: {score}%")
            if score > highest_score:
                highest_score = score
                best_case = case

        return best_case, highest_score

    # 3. REUSE AND REVISE STAGE (Adaptation Logic)
    def adapt_solution(self, new_case, best_case):
        print("\n--- [REUSE & REVISE STAGE] Adapting Solution ---")
        base_solution = best_case["solution"]
        
        # Scaling factor based on population difference
        pop_ratio = new_case["population"] / best_case["population"]
        
        # Adapted parameters
        adapted_shelter = math.ceil(base_solution["shelter_capacity_needed"] * pop_ratio)
        adapted_food_packs = math.ceil(int(base_solution["resource_allocation"].split(',')[0].split()[0].replace(',', '')) * pop_ratio)

        adapted_strategy = f"{base_solution['evacuation_strategy']} (Scaled for {new_case['area_type']} population of {new_case['population']:,})"
        adapted_resources = f"{adapted_food_packs:,} food packs, scaled emergency transport units, power supplies"

        adapted_solution = {
            "evacuation_strategy": adapted_strategy,
            "resource_allocation": adapted_resources,
            "shelter_capacity_needed": adapted_shelter
        }

        return adapted_solution

    # 4. RETAIN STAGE (Learning Stage)
    def retain_case(self, new_case, final_solution):
        print("\n--- [RETAIN STAGE] Storing New Experience ---")
        new_id = f"CBR-00{len(self.case_base) + 1}"
        
        stored_entry = {
            "case_id": new_id,
            "name": new_case["event_name"],
            "disaster_type": new_case["disaster_type"],
            "area_type": new_case["area_type"],
            "population": new_case["population"],
            "rainfall_mm": new_case["rainfall_mm"],
            "wind_speed_kmh": new_case["wind_speed_kmh"],
            "solution": final_solution
        }

        self.case_base.append(stored_entry)
        print(f"Successfully retained new case [{new_id}: {new_case['event_name']}] into system knowledge base!")

# Main Execution Flow
def main():
    system = DisasterCBRSystem()

    print("==========================================================")
    print(" DISASTER RESPONSE DECISION SUPPORT SYSTEM (CBR-DSS) ")
    print("==========================================================")

    # Input parameters for new disaster event
    print("\nEnter New Disaster Event Details:")
    event_name = input("Event Name (e.g., Typhoon Mawar 2026): ").strip() or "Typhoon Mawar 2026"
    disaster_type = input("Disaster Type (Typhoon/Flood) [default: Typhoon]: ").strip().capitalize() or "Typhoon"
    area_type = input("Area Type (Urban/Coastal/Rural) [default: Urban]: ").strip().capitalize() or "Urban"
    
    try:
        population = int(input("Affected Population [default: 75000]: "))
    except ValueError:
        population = 75000

    try:
        rainfall = int(input("Expected Rainfall in mm [default: 310]: "))
    except ValueError:
        rainfall = 310

    try:
        wind_speed = int(input("Wind Speed in km/h [default: 210]: "))
    except ValueError:
        wind_speed = 210

    new_case = {
        "event_name": event_name,
        "disaster_type": disaster_type,
        "area_type": area_type,
        "population": population,
        "rainfall_mm": rainfall,
        "wind_speed_kmh": wind_speed
    }

    # Execute CBR Cycle
    best_case, similarity_score = system.retrieve_best_case(new_case)
    
    print(f"\nMost Similar Case Retrieved: {best_case['name']} ({similarity_score}% Match)")
    
    adapted_solution = system.adapt_solution(new_case, best_case)

    # Display Generated Decision Support Output
    print("\n==========================================================")
    print(" RECOMMENDED DISASTER RESPONSE PLAN ")
    print("==========================================================")
    print(f"Evacuation Plan : {adapted_solution['evacuation_strategy']}")
    print(f"Resource Relief : {adapted_solution['resource_allocation']}")
    print(f"Shelter Target  : {adapted_solution['shelter_capacity_needed']:,} individuals capacity")
    print("==========================================================")

    # Retain phase
    system.retain_case(new_case, adapted_solution)

    print(f"\nTotal Cases in Knowledge Base: {len(system.case_base)}")

if __name__ == "__main__":
    main()