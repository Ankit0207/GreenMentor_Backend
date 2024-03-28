const mongoose=require("mongoose")

const blockSchema=mongoose.Schema({
token:String
})

const BlockModel=mongoose.model("Block",blockSchema);

module.exports={
    BlockModel
}