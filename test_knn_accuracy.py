import sys
import os
import random

# Add python_services to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'python_services'))

from routers.nutrition import _calculate_needs, _filter_and_rank, NutritionRequest, FOOD_DB

def run_nutrition_test(num_tests=1000):
    success_count = 0
    total_calories_diff = 0
    
    for i in range(num_tests):
        req = NutritionRequest(
            gender=random.choice(["male", "female"]),
            age=random.randint(18, 65),
            height_cm=random.uniform(150, 195),
            weight_kg=random.uniform(50, 120),
            goal=random.choice(["bulk", "cut", "maintain"]),
            activity_level=random.choice(["sedentary", "light", "moderate", "active", "very_active"]),
            dietary_preference="none",
            favorite_foods=[],
            disliked_foods=[],
            allergies=[]
        )
        
        needs = _calculate_needs(req)
        
        breakfasts = _filter_and_rank("breakfast", req, needs, 1)
        lunches = _filter_and_rank("lunch", req, needs, 1)
        dinners = _filter_and_rank("dinner", req, needs, 1)
        snacks = _filter_and_rank("snack", req, needs, 1)
        
        if not (breakfasts and lunches and dinners and snacks):
            continue
            
        total_meal_cals = breakfasts[0]["calories"] + lunches[0]["calories"] + dinners[0]["calories"] + snacks[0]["calories"]
        
        target = needs.daily_calories
        
        # Calculate percentage difference
        diff_pct = abs(total_meal_cals - target) / target
        total_calories_diff += diff_pct
        
        # Consider it highly accurate if within 15% of the algorithmic target
        if diff_pct <= 0.15:
            success_count += 1
            
    accuracy = (success_count / num_tests) * 100
    avg_diff = (total_calories_diff / num_tests) * 100
    
    print(f"Total Tests: {num_tests}")
    print(f"Caloric Target Match Accuracy (+/- 15% margin): {accuracy:.2f}%")
    print(f"Average Variance from Target: {avg_diff:.2f}%")

if __name__ == "__main__":
    run_nutrition_test()
