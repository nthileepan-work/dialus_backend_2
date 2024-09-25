const { adds } = require('../Models/addsModel'); // Import the adds model

// Controller for getting all ads with status 1
const getallController = async (req, res) => {
    try {
        // Fetch all ads where status is 1 (visible)
        const allAdds = await adds.findAll({
            where: {
                status: 1 // Only get ads with status 1
            }
        });
        res.json(allAdds); // Send the filtered ads as a response
    } catch (error) {
        res.status(500).json({ message: 'Error fetching ads', error });
    }
};

module.exports = {
    getallController,
};
