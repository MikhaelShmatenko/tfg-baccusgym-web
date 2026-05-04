const PlansModel = require("../models/plans-model");

class PlansService {
  async getAllPlans() {
    let plans;
    try {
      plans = await PlansModel.getAllPlans();
    } catch (error) {
      throw new Error("GETTING_PLANS_FAILED");
    }
    if (!plans || plans.length === 0) {
      throw new Error("NO_PLANS_FOUND");
    }
    return plans;
  }
  async getPlanById(idPlan) {
    let plan;
    try {
      plan = await PlansModel.getPlanById(idPlan);
    } catch (error) {
      throw new Error("GETTING_PLAN_FAILED");
    }

    if (!plan) {
      throw new Error("PLAN_NOT_FOUND");
    }
    return plan;
  }
}

module.exports = new PlansService();
