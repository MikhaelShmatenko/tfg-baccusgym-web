const UsersPlansModel = require("../models/user-plans-model");
const PlansModel = require("../models/plans-model");

class UserPlansService {
  async setUserPlan(iduser, idplan, start_date, is_active) {
    try {
      const planInfo = await PlansModel.getPlanById(idplan);
      if (!planInfo) {
        throw new Error("PLAN_NOT_FOUND");
      }

      const duration = planInfo.duration_days;
      let end_date = null;
      let remaining_days = null;

      if ([1, 2, 3].includes(Number(idplan))) {
        const date = new Date(start_date + "T00:00:00");
        date.setDate(date.getDate() + duration);
        end_date = date.toISOString().split("T")[0];
      } else if ([4, 5].includes(Number(idplan))) {
        remaining_days = duration;
      }

      return await UsersPlansModel.updateUserPlan(
        iduser,
        idplan,
        start_date,
        end_date,
        remaining_days,
        is_active,
      );
    } catch (error) {
      if (error.message === "PLAN_NOT_FOUND") {
        throw error;
      }
      throw new Error("USER_PLAN_UPDATE_FAILED");
    }
  }

  async substractDay(iduser) {
    try {
      const updatedPlan = await UsersPlansModel.substractRemainingDays(iduser);
      if (!updatedPlan) {
        throw new Error("NO_ACTIVE_BONO_PLAN");
      }
      return updatedPlan;
    } catch (error) {
      if (error.message === "NO_ACTIVE_BONO_PLAN") {
        throw error;
      }
      throw new Error("SUBTRACT_DAY_FAILED");
    }
  }

  async deactivatePlan(iduser) {
    try {
      return await UsersPlansModel.deactivateUserPlan(iduser);
    } catch (error) {
      throw new Error("DEACTIVATE_PLAN_FAILED");
    }
  }
}

module.exports = new UserPlansService();
