
import mongoose from "../DBConnect";
var BaseChannel = new mongoose.Schema({
    // table gom cac thuoc tinh sau:
    channel: String,
    quantity: Number,
    expried: Number,
    createAt: {
        type: Number,
        default: Date.now()
    }
});
//Model: tuong tac khi thuc hien lenh
var ModelBaseChannel = mongoose.model("BaseChannel", BaseChannel); //Ten cua table = AccountModel
export default ModelBaseChannel;