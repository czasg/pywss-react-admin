import role from "./system/role";
import user from "./system/user";
import task from "./async_task/task";

class API {
    constructor() {
        this.AsyncTask = {
            task,
        }
        this.System = {
            role,
            user,
        };
    }
}

export default new API();
