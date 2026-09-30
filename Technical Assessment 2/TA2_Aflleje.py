import random

# ==========================================
# Task 1: Environment Setup
# ==========================================
class Environment:
    def __init__(self, initial_states=None):
        if initial_states is None:
            # Default state: Rooms A, B, and optional room C
            self.rooms = {"A": "Dirty", "B": "Dirty", "C": "Dirty"}
        else:
            self.rooms = initial_states

    def is_dirty(self, room):
        return self.rooms.get(room) == "Dirty"

    def clean_room(self, room):
        self.rooms[room] = "Clean"

    def display_state(self):
        return self.rooms

    def render_grid(self, agent_location):
        # Text-based grid visualization for Bonus Task
        grid_str = "["
        for room, state in self.rooms.items():
            status = "D" if state == "Dirty" else "C"
            if room == agent_location:
                grid_str += f" >{room}:{status}< "
            else:
                grid_str += f"  {room}:{status}  "
        grid_str += "]"
        return grid_str

# ==========================================
# Task 2: Rule-Based Vacuum Agent
# ==========================================
class VacuumAgent:
    def __init__(self, initial_location="A"):
        self.location = initial_location

    def perceive_and_act(self, env):
        current_room = self.location
        
        # Rule 1: If current room is dirty, clean it
        if env.is_dirty(current_room):
            env.clean_room(current_room)
            action = f"Cleaned Room {current_room}"
        # Rule 2: If current room is clean, move to another dirty room or next room
        else:
            dirty_rooms = [r for r, state in env.rooms.items() if state == "Dirty" and r != current_room]
            if dirty_rooms:
                next_room = random.choice(dirty_rooms) # Bonus Task logic
            else:
                # Sequential fallback movement
                all_rooms = list(env.rooms.keys())
                current_idx = all_rooms.index(current_room)
                next_room = all_rooms[(current_idx + 1) % len(all_rooms)]
            
            action = f"Moved from Room {self.location} to Room {next_room}"
            self.location = next_room
            
        return action

# ==========================================
# Task 3 & Bonus Task: Run Simulation
# ==========================================
def main():
    print("=== Rule-Based Vacuum Cleaner Agent Simulation ===")
    
    # Task 1: Allow user to input initial states for rooms
    state_a = input("Enter state for Room A (Dirty/Clean) [default: Dirty]: ").strip().capitalize() or "Dirty"
    state_b = input("Enter state for Room B (Dirty/Clean) [default: Dirty]: ").strip().capitalize() or "Dirty"
    
    include_c = input("Include Room C for Bonus Task? (y/n) [default: y]: ").strip().lower() != 'n'
    
    initial_states = {"A": state_a, "B": state_b}
    if include_c:
        state_c = input("Enter state for Room C (Dirty/Clean) [default: Dirty]: ").strip().capitalize() or "Dirty"
        initial_states["C"] = state_c
        
    env = Environment(initial_states)
    agent = VacuumAgent(initial_location="A")
    
    try:
        steps = int(input("\nEnter number of steps to run: "))
    except ValueError:
        steps = 5
        
    print("\n--- Simulation Started ---")
    print(f"Initial State: {env.display_state()}")
    print(f"Grid Layout: {env.render_grid(agent.location)}\n")
    
    for step in range(1, steps + 1):
        action = agent.perceive_and_act(env)
        print(f"Step {step}:")
        print(f"  Agent Location: Room {agent.location}")
        print(f"  Action Taken  : {action}")
        print(f"  Environment   : {env.display_state()}")
        print(f"  Grid View     : {env.render_grid(agent.location)}")
        print("-" * 45)

if __name__ == "__main__":
    main()