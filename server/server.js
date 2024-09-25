const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const bodyParser = require('body-parser');

// Set up a connection to MySQL
const sequelize = new Sequelize('sample_db1', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
    port: 3308
});
 
// Define the `Category` model
const Category = sequelize.define('Category', {
    cate_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    cate_name: {
        type: DataTypes.STRING
    },
    cate_seo_url: {
        type: DataTypes.STRING
    },
    cate_status: {
        type: DataTypes.INTEGER
    },
    created_at: {
        type: DataTypes.DATE
    },
    updated_at: {
        type: DataTypes.DATE
    }
}, {
    tableName: 'categories',
    timestamps: false 
});

// Define the `FreeListing` model
const FreeListing = sequelize.define('FreeListing', {
    org_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    org_name: DataTypes.STRING,
    org_seo_url: DataTypes.STRING,
    org_city: DataTypes.INTEGER,
    org_district: DataTypes.INTEGER,
    org_location: DataTypes.STRING,
    org_base_category: DataTypes.STRING,
    org_description: DataTypes.STRING,
    org_created_date: DataTypes.DATE,
    org_update_date: DataTypes.DATE,
    org_contact: DataTypes.STRING
}, { tableName: 'free_listings', timestamps: false });

const Contact = sequelize.define('Contact', {
    contact_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    org_id: DataTypes.INTEGER,
    type: DataTypes.STRING,
    value: DataTypes.STRING
}, { tableName: 'contacts', timestamps: false });


// Define the `City` model
const City = sequelize.define('City', {
    city_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    city_name: {
        type: DataTypes.STRING
    },
    city_district: {
        type: DataTypes.INTEGER
    },
    city_status: {
        type: DataTypes.INTEGER
    }
}, {
    tableName: 'cities',
    timestamps: false
});

// Define the `District` model
const District = sequelize.define('District', {
    district_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    district_name: {
        type: DataTypes.STRING
    },
    district_image: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'districts',
    timestamps: false
});

// Initialize the Express app
const app = express();


// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

// Connect to the database
sequelize.authenticate().then(() => {
    console.log("Connected to MySQL");
}).catch(err => {
    console.error("Unable to connect to the database:", err);
});

// Route to view all categories
// Route to view categories by keyword (if provided), or all categories if no keyword is found
// Route to view categories by keyword (case-insensitive), or all categories if no keyword is found
// Route to view categories by keyword (case-insensitive), or all categories if no keyword is found
app.get('/view', async (req, res) => {
    try {
        const { keyword } = req.query;

        let categories;

        if (keyword) {
            // Split the keyword by spaces into individual words
            const words = keyword.split(' ');

            // Build the `OR` conditions for Sequelize to search each word
            const conditions = words.map(word => ({
                cate_name: {
                    [Sequelize.Op.like]: `%${word}%`
                }
            }));

            // Search for categories that match any of the words in the keyword
            categories = await Category.findAll({
                where: {
                    [Sequelize.Op.or]: conditions
                }
            });

            // If no categories are found with the keyword, return all categories
            if (categories.length === 0) {
                categories = await Category.findAll();
            }
        } else {
            // If no keyword is provided, return all categories
            categories = await Category.findAll();
        }

        res.json(categories);
    } catch (error) {
        console.error("Error fetching data: ", error);
        res.status(500).send("An error occurred");
    }
});





// Route to get category by ID
app.get('/view/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByPk(id);

        if (category) {
            res.json(category);
        } else {
            res.status(404).send("Category not found");
        }
    } catch (error) {
        console.error("Error fetching category: ", error);
        res.status(500).send("An error occurred");
    }
});

// POST route to create a new free listing
app.post('/listings', async (req, res) => {
    const { name, category, city, district, address, description, contacts } = req.body;

    try {
        // Assuming city and district IDs are already known or you have logic to get/create them
        const cityId = 0; // Function to fetch city ID
        const districtId = 0; // Function to fetch district ID

        // Prepare SEO URL (based on organization name, for example)
        const orgSeoUrl = name.toLowerCase().replace(/\s+/g, '-');

        // Insert data into `free_listings`
        const newListing = await FreeListing.create({
            org_name: name,
            org_seo_url: orgSeoUrl,
            org_city: cityId,
            org_district: districtId,
            org_location: address,
            org_base_category: category,
            org_description: description,
            org_created_date: new Date(),
            org_update_date: new Date()
        });

        // Insert contacts into `contacts` table
        const orgId = newListing.org_id;

        // Insert each contact into `contacts` table
        const contactPromises = contacts.map(contact => {
            return Contact.create({
                org_id: orgId,
                type: contact.type,
                value: contact.value
            });
        });

        await Promise.all(contactPromises);

        res.status(201).json(newListing); // Successfully created listing
    } catch (error) {
        console.error('Error creating free listing:', error);
        res.status(500).send('An error occurred');
    }
});


app.post('/view2',async (req, res) => {
    res.send(req.body)
})

// Route to view all cities
app.get('/cities', async (req, res) => {
    try {
        const cities = await City.findAll();
        res.json(cities);
    } catch (error) {
        console.error("Error fetching cities: ", error);
        res.status(500).send("An error occurred");
    }
});

// Route to get a city by ID
app.get('/cities/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const city = await City.findByPk(id);

        if (city) {
            res.json(city);
        } else {
            res.status(404).send("City not found");
        }
    } catch (error) {
        console.error("Error fetching city: ", error);
        res.status(500).send("An error occurred");
    }
});

// Route to view all districts
app.get('/districts', async (req, res) => {
    try {
        const districts = await District.findAll();
        res.json(districts);
    } catch (error) {
        console.error("Error fetching districts: ", error);
        res.status(500).send("An error occurred");
    }
});

// Route to get a district by ID
app.get('/districts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const district = await District.findByPk(id);

        if (district) {
            res.json(district);
        } else {
            res.status(404).send("District not found");
        }
    } catch (error) {
        console.error("Error fetching district: ", error);
        res.status(500).send("An error occurred");
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
