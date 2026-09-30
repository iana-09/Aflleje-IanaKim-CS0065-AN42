
# PART 1: Knowledge Representation (KR) Setup
facts = {
    "temperature": 34,         # Category 1: Temperature (Numeric °C)
    "is_raining": True,        # Category 2: Environment (Boolean)
    "humidity": 88,            # Category 1: Temperature/Moisture (Numeric %)
    "time_of_day": "Afternoon",# Category 3: Status/Time (String)
    "wind_speed": 18           # Category 2: Environment (Numeric km/h)
}

# PART 2: Rule-Based Reasoning (RBR)
def rule_hot_weather(f):
    if f["temperature"] > 30:
        return "Action: Turn on the air conditioner."

def rule_rainy_weather(f):
    if f["is_raining"]:
        return "Action: Bring an umbrella when going outside."

def rule_high_humidity(f):
    if f["humidity"] > 80 and f["temperature"] > 28:
        return "Action: Set air conditioner mode to Dehumidify."

def rule_afternoon_heat(f):
    if f["time_of_day"] == "Afternoon" and f["temperature"] > 32:
        return "Action: Close window blinds to block direct sunlight."

def inference_engine(knowledge_base):
    rules = [
        rule_hot_weather,
        rule_rainy_weather,
        rule_high_humidity,
        rule_afternoon_heat
    ]
    
    inferred_actions = []
    for rule in rules:
        result = rule(knowledge_base)
        if result:
            inferred_actions.append(result)
            
    return inferred_actions

# PART 3: Case-Based Reasoning (CBR)
# Case Base containing past problems and verified solutions
case_base = [
    {
        "case_id": "Case-1",
        "problem": {"temperature_high": True, "raining": False, "high_humidity": True},
        "solution": "Turn on AC in dry mode and close window shades."
    },
    {
        "case_id": "Case-2",
        "problem": {"temperature_high": True, "raining": True, "high_humidity": True},
        "solution": "Turn on AC, close windows, and stay indoors with umbrella ready."
    },
    {
        "case_id": "Case-3",
        "problem": {"temperature_high": False, "raining": True, "high_humidity": True},
        "solution": "Wear a light rain jacket and open ventilation vents."
    }
]

def calculate_similarity(new_problem, past_case_problem):
    matches = 0
    total_features = len(new_problem)
    
    for key, value in new_problem.items():
        if past_case_problem.get(key) == value:
            matches += 1
            
    return matches / total_features

def cbr_cycle(new_problem):
    print("\n--- CBR Step 1: RETRIEVE ---")
    best_case = None
    highest_similarity = -1.0
    
    for case in case_base:
        sim = calculate_similarity(new_problem, case["problem"])
        print(f"Checking {case['case_id']}: Similarity = {sim * 100:.1f}%")
        if sim > highest_similarity:
            highest_similarity = sim
            best_case = case
            
    print(f"\n--- CBR Step 2: REUSE ---")
    retrieved_solution = best_case["solution"]
    print(f"Retrieved Solution from [{best_case['case_id']}]: {retrieved_solution}")
    
    print("\n--- CBR Step 3: REVISE ---")
    # Custom adaptation logic for revision
    if new_problem.get("raining") and "umbrella" not in retrieved_solution:
        final_solution = retrieved_solution + " (Revised: Add recommendation to secure wet footwear outside.)"
    else:
        final_solution = retrieved_solution
    print(f"Final Adapted Solution: {final_solution}")
    
    print("\n--- CBR Step 4: RETAIN ---")
    new_case_id = f"Case-{len(case_base) + 1}"
    new_case = {
        "case_id": new_case_id,
        "problem": new_problem,
        "solution": final_solution
    }
    case_base.append(new_case)
    print(f"Successfully saved [{new_case_id}] into Case Base!")
    
    return final_solution

# Main Execution

def main():
    print("=====================================================================")
    print(" TA4: KNOWLEDGE REPRESENTATION, RBR, AND CBR COMPARISON ")
    print("=====================================================================")
    
    # Run RBR
    print("\n>>> EXECUTION PART 1: Rule-Based Reasoning (RBR) <<<")
    print("Current Facts (Working Memory):", facts)
    actions = inference_engine(facts)
    print("\nInferred RBR Actions:")
    for act in actions:
        print(f" - {act}")
        
    # Run CBR
    print("\n\n>>> EXECUTION PART 2: Case-Based Reasoning (CBR) <<<")
    # Represent current situation as a new problem
    new_situation = {
        "temperature_high": facts["temperature"] > 30,
        "raining": facts["is_raining"],
        "high_humidity": facts["humidity"] > 80
    }
    print("New Problem Situation:", new_situation)
    cbr_cycle(new_situation)

if __name__ == "__main__":
    main()