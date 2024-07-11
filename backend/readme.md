# Auth Registration Flow 
In short: 
    /auth/register (endpoint)
        ---> auth.controller.js ===> register function (end destination)
        
Explanation:
/index.js ===> createServer(app)
    ---> /src/config/express.config.js ====> .use(mainRouter)
        ---> mainRouter ===> /src/config/router.config.js ===> .use('/auth', authRouter)
            ---> authRouter ===> /src/modules/auth/auth.router.js ===> .post('/register', bodyValidator(rule), authCtrl.register)
                ---> rule ===> /src/modules/auth/auth.dto.js ===> exports (schema / rule) => registerDTO
                ---> bodyValidator(schema) ===> /src/middleware/validator.middleware.js ===> exports bodyValidator()
                    ---> validation 
                        -> success => next()
                            -> authCtrl.register ===> /src/modules/auth/auth.controller.js => class => register()
                        -> failed => next(error)
                            -> /src.config/express.config.js ===> app.use(error, req, res, next) => res.status(422).json(...)


# Mail 
    -   to enable sending mail we need SMTP server
    -   SMTP server are Gmail SMTP server, Mailtrap, MailerSend, Send Grid and soon 
    -   protocols used by SMTP servers ===> smtp, pop3, imap 
    -   smtp is used when sending mails, port ===> (25 or 465 or 587 or 2525) 
    -   pop3 is used when receiving mails, port ===> 1100 or 9950


# Flow of sending mail from node app 
Node app ===> SMTP server ===> Queue build (server build queue of mails and sends to receiver in FIFO order) ===> Receiver mail




{name: "beepul",email: "beepul@gmail.com",password: "Admin123#",status: "active",activatiionToken: null,role: "customer"}


name 
price 
discount
acterDiscountPrice
category
brand 

# DATABASE
mongosh ---> start mongosh in terminal
show dbs  ---> lists out all db 
db ---> returns current db name 
use <db_name> ---> switch to <db_name> if exist , if not create and switch to <db_name>
show tables ---> lists out all tables from current db 


#   CREATE 
db.users.insertOne({key: value})
db.users.insertMany([{key: value},{key: value},{key: value},{key: value}])


#   READ 
db.users.find({role:"admin"})
db.users.find({name:"userone",role: "customer"})
db.users.find({$or:[{role: "admin"},{role: "seller"}]})

db.users.find({}, {name: 1, email: 1}) ---> find all users and get only name and email
    ----> {name: 1, email: 1} this is projection


db.users.find({}, {name: 1, email: 1}, sort:{name: "desc"})
db.users.find({}, {name: 1, email: 1}, sort:{name: "desc"}, limit: 5)

#   SOME FILERS 
    $or, $and, $gt, $gte, $lt, $lte, $eq, $ne, $in, $nin, $text

    $or ---> $or:[{role: "admin"},{role: "seller"}]
    $and ---> $and:[{role: "admin"},{status: "active"}]

    {
        $<$or, $and, $in, $nin>: [{key: <value/expression>},{key: <value/expression>}]
    }
    {
        key: { 
                $<gt, gte, lt, lte, eq, ne>: <value/exception>
            }
    }


# UPDATE
    ----> db.<collectionName>.updateOne()
    ----> db.<collectionName>.updateMany()
    Args 
        filter ---> find filter 
        body ---> {
            $set: <updateBody>
        }
        options: {
            upsert: <boolean> // if filter found update if not insert as new data  
        }


# DB Usages
    ----> ORM / ODM 
        ===> ORM -> Object Relational Mapping / Modelling
        ===> ODM -> Object Document Mapping / Modelling 
    
    - No sql server -> ODM 
    - SQL Server -> ORM
  
    ORM / ODM  
        - provides ===> DB tables ==> Project Model defination
        - Table/Collection name should be always plural form of your data/entity. eg. users, products
        - All the models/Repo in your project should be in singular case. eg. User, Product 
        - All the columns/keys of a table/collection is the property of your model class 
  
# Mongodb 
    ODM ===> mongoose

# SQL server 
    ORM ===> sequelize, typeorm, prisma 




## Identify the Entity 
Ecommerce
    - banner 
    - users
    - category
    - brand 
    - product 
    - order 
    - transactions
    - offers
    - coupons/vouchers
    - reviews 
  
  
Inventory ManagementSystem 
    - Order 
    - stock
    - payment/Cash Flow 

Logistic ManagementSystem
    - tracking 
    - delivery status 


ER -> 
    - https://app.diagrams.net/
    - https://dbdiagram.io/












// table role {
//   _id ObjectId
//   name text 
// } 

enum ROLE {
  admin
  seller
  customer
}

enum STATUS {
  active
  inactive
}

table users{
  _id ObjectId
  name text 
  email text [unique]
  password text 
  // role ObjectId [ref: - role._id]
  role ROLE [default: 'customer']
  status STATUS [default: 'inactive']
  activationToken text 
  image text 
  phone text
  address json
  createdBy ObjectId [ref: - users._id, default: null]
  createdAt datetime 
  updatedBy ObjectId [ref: - users._id, default: null]
  updatedAt datetime
}

table banners {
  _id ObjectId
  title text 
  link text 
  status STATUS [default: 'inactive']
  image text 
  createdBy ObjectId [ref: > users._id, default: null]
  createdAt datetime 
  updatedBy ObjectId [ref: > users._id, default: null]
  updatedAt datetime
}

table brands {
  _id ObjectId
  title text [unique]
  slug text [unique]
  status STATUS [default: 'inactive']
  image text 
  homeSection bool [default: false]
  createdBy ObjectId [ref: > users._id, default: null]
  createdAt datetime 
  updatedBy ObjectId [ref: > users._id, default: null]
  updatedAt datetime
}


table categories {
  _id ObjectId
  title text [unique]
  slug text [unique]
  parentId ObjectId [ref: > categories._id, default: null]
  status STATUS [default: 'inactive']
  image text 
  createdBy ObjectId [ref: > users._id, default: null]
  createdAt datetime 
  updatedBy ObjectId [ref: > users._id, default: null]
  updatedAt datetime
}

table products {
  _id ObjectId
  title text [unique]
  slug text [unique]
  summary text 
  description text 
  categories ObjectId [ref: <> categories._id]  // Handled by mongodb
  price number
  discount number
  afterDiscount number
  brand ObjectId [ref: - brands._id]
  stock number // optional 
  sku text // optional
  featured bool [default: false]
  seller ObjectId [ref: - users._id]
  status STATUS [default: 'inactive']
  image text 
  createdBy ObjectId [ref: > users._id, default: null]
  createdAt datetime 
  updatedBy ObjectId [ref: > users._id, default: null]
  updatedAt datetime
}

enum CARTSTATUS{
  pending
  cancelled
  confirmed
  completed
}

table CartDetails {
  _id ObjectId
  orderId ObjectId [ref: - orders._id] 
  buyerId ObjectId [ref: < users._id]
  productId Object [ref: - products._id]
  quantity number 
  price number 
  amount number 
  status CARTSTATUS
  isPaid bool [default: false] 
  createdBy ObjectId [ref: > users._id, default: null]
  createdAt datetime 
  updatedBy ObjectId [ref: > users._id, default: null]
  updatedAt datetime
}

enum ORDERSTATUS {
  pending 
  processing
  cancelled
  confirmed
  delivered
}

table orders {
  _id ObjectId 
  buyerId ObjectId [ref: < users._id]
  orderDate date 
  orderDetail ObjectId [ref: < CartDetails._id]
  subTotal number 
  discount number 
  deliveryAmount number 
  tax amount 
  serviceCharge number 
  totalAmount number 
  isPaid bool [default: false] 
  status ORDERSTATUS [default: 'pending']
  createdBy ObjectId [ref: > users._id, default: null]
  createdAt datetime 
  updatedBy ObjectId [ref: > users._id, default: null]
  updatedAt datetime
}


School Management System (required: createdAt, createdBy, updatedAt, updatedBy, deletedAt, deletedBy)
student 
  id name email dob address phone gender
  id name email phone address gender

studentGuardian
  id, studentId, guardianId

Classes 
  id, name 
Section 
  id, name 
Tearcher
  id, name, phone, address, email
Subject
  id, name, 
subTeacher 
  id, teacherId, subjectId 
classSub
  id, classId, subjectId 
classSection 
  id, sectionId, classId, classTeacherId, monitorId

classStudent
  id, studentId, classSectionId

classRoutine
  id, classSectionId, day, period, subjectId, teacherId

Attendance
  id, classSectionId, date, studentId, status, remarks, teacherId 

Exam  
  id, classSectionId, startDate, endDate, examType,
ExamSchedule
  id, examId, date, subjectId, passMark, fullMark, practicalMark

Result
  id, studentId, examId, scheduleId, obtMarks, remarks, percentage
