const PlansModel = require("../models/plans-model");

class PlansService {
  async getAllPlans() {
    const plans = await PlansModel.getAllPlans();
    if (!plans || plans.length === 0) {
      throw new Error("NO_PLANS_FOUND");
    }
    return plans;
  }
}

module.exports = new PlansService();
