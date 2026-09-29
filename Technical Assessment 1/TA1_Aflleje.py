import agentpy as ap
import random
import numpy as np
import matplotlib.pyplot as plt

# ==========================================
# Task 1 & 2: Agent Definition with Path Tracking & Avoidance
# ==========================================
class AdvancedWalker(ap.Agent):
    def setup(self):
        # Task 1: Initialize list to track path history
        self.path = []

    def step(self):
        # Record current position before attempting a move
        self.path.append(self.position)
        
        # Directions: Up, Down, Left, Right
        directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]
        random.shuffle(directions)
        
        moved = False
        for dx, dy in directions:
            # Enforce grid boundaries
            new_x = max(0, min(self.model.p.grid_size[0] - 1, self.position[0] + dx))
            new_y = max(0, min(self.model.p.grid_size[1] - 1, self.position[1] + dy))
            new_pos = (new_x, new_y)
            
            # Task 2: Avoidance Rule — check if target cell is already occupied
            occupied_positions = [a.position for a in self.model.agents if a != self]
            if new_pos not in occupied_positions:
                self.position = new_pos
                moved = True
                break
                
        # If surrounded/blocked by other agents, stay in place

# ==========================================
# Model Definition
# ==========================================
class RandomWalkModel(ap.Model):
    def setup(self):
        self.agents = ap.AgentList(self, self.p.agents, AdvancedWalker)
        
        # Initialize non-overlapping starting positions
        grid_w, grid_h = self.p.grid_size
        all_positions = [(x, y) for x in range(grid_w) for y in range(grid_h)]
        starting_positions = random.sample(all_positions, min(self.p.agents, len(all_positions)))
        
        for agent, pos in zip(self.agents, starting_positions):
            agent.position = pos
            
        self.grid = ap.Grid(self, self.p.grid_size, torus=False)
        self.grid.add_agents(self.agents)

    def step(self):
        self.agents.step()

    def end(self):
        # Save final position to path history
        for agent in self.agents:
            agent.path.append(agent.position)

# ==========================================
# Task 3: Spatial Analysis Function
# ==========================================
def analyze_positions(model, label="Simulation"):
    final_positions = np.array([agent.position for agent in model.agents])
    center = np.array([model.p.grid_size[0] / 2.0, model.p.grid_size[1] / 2.0])
    
    mean_pos = np.mean(final_positions, axis=0)
    std_pos = np.std(final_positions, axis=0)
    distances_from_center = np.linalg.norm(final_positions - center, axis=1)
    avg_dist = np.mean(distances_from_center)
    
    print(f"--- Analysis Results [{label}] ---")
    print(f"Mean Position (X, Y): ({mean_pos[0]:.2f}, {mean_pos[1]:.2f})")
    print(f"Position Std Dev (X, Y): ({std_pos[0]:.2f}, {std_pos[1]:.2f})")
    print(f"Average Distance from Center: {avg_dist:.2f} units\n")

# ==========================================
# Task 4: Compare Scenarios & Visualizations
# ==========================================
def run_comparison():
    # Scenario A: Low density, short duration
    params_A = {'agents': 5, 'grid_size': (10, 10), 'steps': 20}
    model_A = RandomWalkModel(params_A)
    model_A.run()
    
    # Scenario B: Higher density, longer duration
    params_B = {'agents': 15, 'grid_size': (10, 10), 'steps': 50}
    model_B = RandomWalkModel(params_B)
    model_B.run()

    # Print distribution stats (Task 3)
    analyze_positions(model_A, "Scenario A (5 Agents, 20 Steps)")
    analyze_positions(model_B, "Scenario B (15 Agents, 50 Steps)")

    # Plot trajectories and final positions side-by-side
    fig, axes = plt.subplots(1, 2, figsize=(12, 6))

    for ax, model, title in zip(axes, [model_A, model_B], ["Scenario A", "Scenario B"]):
        ax.set_xlim(-0.5, model.p.grid_size[0] - 0.5)
        ax.set_ylim(-0.5, model.p.grid_size[1] - 0.5)
        ax.set_xticks(range(model.p.grid_size[0]))
        ax.set_yticks(range(model.p.grid_size[1]))
        ax.grid(True, linestyle='--', alpha=0.6)
        ax.set_title(title)

        # Draw full trajectory paths and mark final points
        for agent in model.agents:
            path_x, path_y = zip(*agent.path)
            ax.plot(path_x, path_y, alpha=0.6, linewidth=1.5)
            ax.scatter(path_x[-1], path_y[-1], s=80, zorder=5)

    plt.tight_layout()
    plt.show()

if __name__ == "__main__":
    run_comparison()