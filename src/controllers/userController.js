class UserController {
  constructor(authService) {
    this.authService = authService;

    this.getProfile = this.getProfile.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
  }

  async getProfile(req, res, next) {
    try {
      const user = await this.authService.getProfile(req.user.id);
      return res.status(200).json({ user });
    } catch (error) {
      return next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const user = await this.authService.updateProfile(req.user.id, req.body);
      return res.status(200).json({ user });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = UserController;
