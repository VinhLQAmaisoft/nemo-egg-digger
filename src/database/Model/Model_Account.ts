
import mongoose from "../DBConnect";
var Account = new mongoose.Schema({
    // table gom cac thuoc tinh sau:
    username: String,
    password: String,
    cookies: Array,
    updatedAt: {
        type: Number,
        default: -1
    },
    createAt: {
        type: Number,
        default: Date.now()
    }
});
//Model: tuong tac khi thuc hien lenh
var ModelAccount = mongoose.model("Account", Account); //Ten cua table = AccountModel
export default ModelAccount;