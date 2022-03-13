
import mongoose from "../DBConnect";
var Job = new mongoose.Schema({
    // table gom cac thuoc tinh sau:
    channel: String,
    quantity: Number,
    expried: Number,
    worker: String,
    createAt: {
        type: Number,
        default: Date.now()
    }
});
//Model: tuong tac khi thuc hien lenh
var ModelJob = mongoose.model("Job", Job); //Ten cua table = AccountModel
export default ModelJob;