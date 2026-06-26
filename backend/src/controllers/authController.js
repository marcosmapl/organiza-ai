class AuthController {
  constructor(authService) {
    this.authService = authService
  }

  register = async (req, res) => {
    const response = await this.authService.register(req.validated)
    res.status(201).json(response)
  }

  login = async (req, res) => {
    const response = await this.authService.login(req.validated)
    res.json(response)
  }
}

module.exports = AuthController
