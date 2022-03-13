import mongoose from "mongoose";//Mongoose thuần chưa kết nối db
require('dotenv').config()
//kết nối đb
mongoose.connect(`mongodb+srv://Vinh2611:amingovictus@cluster0.6og83.mongodb.net/Nimo_Egg?retryWrites=true&w=majority`);

const db = mongoose.connection;//Check xem có lỗi hay không
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
    console.log(`Kết nối database Nimo_Egg thành công`);
});
export default mongoose;//Mongoose t đã kết nối db