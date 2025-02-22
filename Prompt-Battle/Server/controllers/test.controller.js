const { TestService } = require('../services/test.service');

class TestController {
    static async test(req, res) {
        try {
            const result = await TestService.test();
            res.json({ success: true, data: result });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

module.exports = { TestController };
