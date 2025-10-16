class AuthController {
  constructor(authService) {
    this.authService = authService;

    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.refresh = this.refresh.bind(this);
    this.googleAuth = this.googleAuth.bind(this);
    this.requestPasswordReset = this.requestPasswordReset.bind(this);
    this.confirmPasswordReset = this.confirmPasswordReset.bind(this);
  }

  async register(req, res, next) {
    try {
      const { user, tokens } = await this.authService.register(req.body);
      return res.status(201).json({ user, tokens });
    } catch (error) {
      return next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { user, tokens } = await this.authService.login(req.body);
      return res.status(200).json({ user, tokens });
    } catch (error) {
      return next(error);
    }
  }

  async logout(req, res, next) {
    try {
      await this.authService.logout({ refreshToken: req.body.refreshToken });
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  }

  async refresh(req, res, next) {
    try {
      const result = await this.authService.refresh({ refreshToken: req.body.refreshToken });
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }

  async googleAuth(req, res, next) {
    try {
      const { user, tokens } = await this.authService.googleAuth({ idToken: req.body.idToken });
      return res.status(200).json({ user, tokens });
    } catch (error) {
      return next(error);
    }
  }

  async requestPasswordReset(req, res, next) {
    try {
      await this.authService.requestPasswordReset(req.body.email);
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  }

  async confirmPasswordReset(req, res, next) {
    try {
      await this.authService.confirmPasswordReset({ token: req.body.token, newPassword: req.body.newPassword });
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = AuthController;
