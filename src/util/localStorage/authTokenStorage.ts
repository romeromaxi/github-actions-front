interface AuthTokenData {
  accessToken: string,
  refreshToken: string
}

class AuthTokenStorage {
  private readonly keyStorage = 'authTokenLUCStorage';
  private lastAccessToken: string | null = null;
  private lastRefreshToken: string | null = null;

  public save(access: string, refresh: string): void {
    if (this.lastAccessToken === access && this.lastRefreshToken === refresh) return;
    this.lastAccessToken = access;
    this.lastRefreshToken = refresh;
    localStorage.setItem(
        this.keyStorage,
        JSON.stringify({
          refreshToken: refresh,
          accessToken: access
        })
    );
  }

  public updateAccessToken(access: string) {
    const refreshToken = this.getRefreshToken();

    if (refreshToken) this.save(access, refreshToken);
  }

  public _get(): AuthTokenData | null {
    let authToken: string = localStorage.getItem(this.keyStorage) as string;

    if (authToken) {
      try {
        const authTokenData = JSON.parse(authToken) as AuthTokenData;

        if (!authTokenData.accessToken || !authTokenData.refreshToken) {
          this.removeFromStorage();
          return null;
        }

        this.lastAccessToken = authTokenData.accessToken;
        this.lastRefreshToken = authTokenData.refreshToken;
        return authTokenData;

      } catch (error) {
        this.removeFromStorage();
        return null;
      }
    }

    return null;
  }

  public getAccessToken(): string | null {
    if (this.lastAccessToken) return this.lastAccessToken;
    return this._get()?.accessToken ?? null
  }

  public getRefreshToken(): string | null {
    if (this.lastRefreshToken) return this.lastRefreshToken;
    return this._get()?.refreshToken ?? null;
  }

  public removeFromStorage(): void {
    this.lastAccessToken = null;
    this.lastRefreshToken = null;
    localStorage.removeItem(this.keyStorage);
  }
}

export const authTokenStorage = new AuthTokenStorage();