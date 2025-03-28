import mongoose  from "mongoose";

const subscriptionSchema = new  mongoose.Schema({
    name:{
     type:String,
     required:[true,"Please Enter The type Of Subscription."],
     trim:true,
     minlength:2,
     maxlength:100,
    },
    price:{
        type:Number,
        required:[true,'Subscription Price is Required.'],
        min:[0,'Price must be greater than zero.'],
    },
    currency:{
        type:String,
        enum:['INR','USD','EUR','DHS'],
        default:'INR'
    },
    frequency:{
        type:String,
        enum:['daily','weekly','monthly','yearly'],
    },
    category:{
        type:String,
        enum:['Sports','News','Entertainment','Lifestyle','Technology','Finance','Politics','Other'],
        required:true,
    },
    paymentMethod:{
        type:String,
        required:true,
        trim:true,
    },
    status:{
        type:String,
        enum:['active','cancelled','expired'],
        default:'active',
    },
    startDate:{
        type:Date,
        required:true,
        // The validate function ensures that the start date must be in the past or today (not in the future).
        validate:{ 
        validator:(value)=>value <= new Date(),
        message:'Start date must be in the past',
        }
    },
    renewalDate:{
        type:Date,
        validate:{
            validator:function(value){
                return value>this.startDate;
            },
            message:'Renwal date must be after the start date',
        }
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
        index:true,
    }

},
{timestamps:true});


// Auto-calculate renewal date if missing.
subscriptionSchema.pre('save',function(next){
    if(!this.renewalDate){
        const renewalPeriods={
            daily:1,
            weekly:7,
            monthly:30,
            yearly:365,
        };
        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate()+renewalPeriods[this.frequency]);
    }

// Auto-update the status if renewal date has passed
if(this.renewalDate && this.renewalDate < new Date()){
    this.status= 'expired';
}

    next();
})


const Subscription = mongoose.model('Subscription',subscriptionSchema);
export default Subscription;