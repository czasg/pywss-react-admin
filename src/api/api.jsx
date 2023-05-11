import role from "./system/role";
import user from "./system/user";
import task from "./async_task/task";
import stat from "./stat/stat";
import exam from "./exam/exam";

class API {
    constructor() {
        this.AsyncTask = {
            task,
        }
        this.System = {
            role,
            user,
        };
        this.Stat = {
            stat,
        };
        this.Exam = {
            exam,
        };
    }
}

export default new API();
