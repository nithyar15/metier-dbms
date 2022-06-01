var express = require('express');
var app = express();
var mongoose = require("mongoose");
app.use(express.json());
app.use(express.urlencoded());
var port=3000;

mongoose.connect("mongodb+srv://niths:abcd@cluster0.dcjquke.mongodb.net/metier", {
   useNewUrlParser : true, 
   useUnifiedTopology: true
})

app.set('view engine', 'ejs');
app.set('views', './views');

var user_schema = mongoose.Schema({
   username: String,
   password: String,
   age: Number,
   email: String,
   type: String
});
var User = mongoose.model("User", user_schema);

var intern_schema = mongoose.Schema({
    username: String,
    gradyr: Number,
    degree: String,
    type: String,
    city: String,
})
var Intern = mongoose.model("Intern", intern_schema);

var jobseeker_schema = mongoose.Schema({
    username: String,
    degree: String,
    city: String,
    category: String,
    experience: String
})
var Jobseeker = mongoose.model("Jobseeker", jobseeker_schema);

var company_schema = mongoose.Schema({
    c_id: String,
    c_name: String,
    category: String,
    type: String,
    city: String,
    qualification: String
})
var Company = mongoose.model("Company", company_schema);

var university_schema = mongoose.Schema({
    u_id: String,
    u_name: String,
    city: String,
    duration: Number,
    category: String
})
var University = mongoose.model("University", university_schema);

var category_schema = mongoose.Schema({
    category_id: String,
    job_type: String
})
var Category = mongoose.model("Category", category_schema);

var application_schema = mongoose.Schema({
    username: String,
    date_of_appl: Date,
    c_name: String,
    u_name: String,
    type: String,
    status: String,
    resume: Boolean,
    category: String
    
})
var Application = mongoose.model("Application", application_schema);

app.get('/signup', function(req, res){
   res.render('signup');
});

app.post('/signup', function(req, res){
    var user_info = {username: req.body.username, password:req.body.password, age:req.body.age, type: req.body.type, email: req.body.email};

    if(!user_info.username || !user_info.age || !user_info.password || !user_info.email || !user_info.type){
      res.render('dashboard', {
         message: "Sorry, you provided wrong info", mtype: "error"});
   } else {
    User.exists({ username: user_info.username}, 
    function (err, doc) {
    if (err){
        console.log(err);
    }
    else{
        if(doc){
            console.log("User already exists!");
            res.render('user_exists');
        }
        else{
            console.log("Creating new user...")
            var new_user = new User({
            username: user_info.username,
            age: user_info.age,
            password: user_info.password,
            type: user_info.type,
            email: user_info.email
            });
            new_user.save(function(err, User){
            if(err)
                res.render('dashboard', {message: "Database error", mtype: "error"});
            else
                res.render('dashboard', {
                message: "New user signed up!", mtype: "success", person: user_info});
      });
        }
    }
    
    
});
}
});

app.get('/login', function(req, res){
   res.render('login');
});

app.post('/login', function(req, res){
    var user_info = {username: req.body.username, password:req.body.password};

    if(!user_info.username || !user_info.password ){
      res.render('login_dashboard', {
         message: "Sorry, you provided incomplete info", mtype: "error"});
   } 
   else{
    User.exists({ username: user_info.username, password: user_info.password}, 
    function (err, doc) {
        if (err){
            console.log(err);
        }
        else{
            if(doc){
                console.log(user_info);
                console.log("hey");
                res.render('login_dashboard', {
                    message: "User logged in!", 
                    mtype: "success", 
                    person: user_info});
            }
            else{
                        res.render('login_dashboard', {
                            message: "Incorrect Credentials! Please try again.",
                            mtype: "error"
                        });
            }
        }
    });
    }
});
   
app.get('/openings', function(req, res){
    var usrname = req.query.usrname;
    res.render('openings',{
        usrname: usrname
    });
});

app.get('/fulltime', function(req, res){
    
    Company.find(function(err, response){
        var usrname = req.query.usrname;
            res.render('fulltime', {
            companies: response,
            usrname: usrname
        });
        
        
    })
});

app.get('/internships', function(req, res){

    University.find(function(err, response1){
        
        Company.find({type: "Internship"},
    function(err, response2){
        var usrname = req.query.usrname;
        res.render('internships',{
            companies:response2,
            universities: response1,
            usrname: usrname
        })
    })
    })

    
});

app.get('/addcompany', function(req, res){

    res.render('addcompany');
});

app.post('/addcompany', function(req, res){
    var company_info = req.body;

    if(!company_info.c_name || !company_info.c_id || !company_info.category || !company_info.type || !company_info.city || !company_info.qualification ){
      res.render('compadd', {
         message: "Sorry, you provided incomplete info", mtype: "error"});
   } 
   else{
        
            var new_company = new Company({
            c_name: company_info.c_name,
            c_id: company_info.c_id,
            category: company_info.category,
            qualification: company_info.qualification,
            city: company_info.city,
            type: company_info.type,
            });
            new_company.save(function(err, Company){
            if(err)
                res.render('compadd', {message: "Database error", mtype: "error"});
            else
                res.render('compadd', {
                message: "New opening created!", mtype: "success", person: company_info});
      }); 
    }
});

app.get('/categories', function(req, res){
    Category.find(function(err, response){
        var usrname = req.query.usrname;
        res.render('categories', {
            categories: response,
            usrname: usrname
        });
    })
});

app.get('/application', function(req, res){
    res.render('application');
})

app.post('/fulltime', function(req, res){
    var compinfo = req.body.comp;
    var name = req.body.name;
    res.render('application',{
        info: compinfo,
        usrname: name,

    })
})

app.listen(port);