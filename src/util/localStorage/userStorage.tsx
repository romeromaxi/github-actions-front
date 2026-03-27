import { authTokenStorage } from './authTokenStorage';
import { Module } from '../../types/form/login/login-enum';
import { HttpAxiosRequest } from '../../http/httpAxiosBase';
import { HttpAxiosRequestPublicBases } from '../../http/httpAxiosPublicBasesBase';
import { MenuLayoutType } from '../../types/menu/menuLink';
import { ConfigurationEconde } from '../configurations/configurationEncode';
import { CryptoJSHelper } from '../helpers';
import { ValidationStatesType } from '../../types/person/personEnums';
import {personFormatter} from "../formatters/personFormatter";

interface UserCredentials {
  userId: number;
  fullName: string;
  firstName: string;
  lastName: string; 
  displayName: string;
  cuit: string;
  mail: string;
  defaultLanguage: string;
  firstEntry: boolean;
  userType: Module;
  profileId?: number;
  profileIds: number[];
  confirmedMail: boolean;
  confirmedPhoneNumber: boolean;
  confirmedPerson: boolean;
  hasValidatedIdentity: boolean;
  lackConfirmation: boolean;
  hasTaxActivity: boolean;
  validationIdentityStatusCode: number;
  validationIdentityObservations: string;
  mustChangePassword: boolean;
  isFirstLogin: boolean
}

class UserStorage {
  encryptUser: boolean = true;
  keyStorage: string = 'userLUCStorage';
  keyStorageTracking: string = 'userLUCStorageTracking';
  
  encoder: ConfigurationEconde = {
    key: 'KEYencodeLUCUserABCDEFGHSAGIJKLM',
    keyLength: 32,
    iv: 'IVencodeLUCUserA',
    ivLength: 16,
  };
  
  private subscribers: Set<() => void> = new Set();

  public save(
    userId: number,
    fullName: string,
    cuit: string,
    mail: string,
    defaultLanguage: string,
    userType: number,
    profileId: number,
    profileIds: number[],
    confirmedMail: boolean,
    confirmedPhoneNumber: boolean,
    confirmedPerson: boolean,
    validatedIdentity: boolean,
    hasTaxActivity: boolean,
    validationIdentityStatusCode: number,
    validationIdentityObservations: string,
    mustChangePassword: boolean,
    isFirstLogin: boolean,
    accessToken: string,
    refreshToken: string,
  ) {
    const [firstName, lastName, displayName] = personFormatter.getFirstLastAndDisplayNameFromFullName(fullName);

    let userCredentials: UserCredentials = {
      userId: userId,
      fullName: fullName,
      firstName: firstName,
      lastName: lastName,
      displayName: displayName,
      cuit: cuit,
      mail: mail,
      defaultLanguage: defaultLanguage,
      firstEntry: true,
      userType: userType,
      profileId: profileId,
      profileIds: profileIds,
      confirmedMail: confirmedMail,
      confirmedPhoneNumber: confirmedPhoneNumber,
      confirmedPerson: confirmedPerson,
      hasValidatedIdentity: validationIdentityStatusCode === ValidationStatesType.Validated,
      lackConfirmation: !confirmedMail,
      hasTaxActivity: hasTaxActivity,
      validationIdentityStatusCode: validationIdentityStatusCode,
      validationIdentityObservations: validationIdentityObservations,
      mustChangePassword: mustChangePassword,
      isFirstLogin: isFirstLogin,
    };

    this.saveStorage(userCredentials);

    localStorage.setItem(
        this.keyStorageTracking, JSON.stringify({ userId, fullName, mail, })
    );

    authTokenStorage.save(accessToken, refreshToken);
  }

  public get(): UserCredentials | null {
    let userStorage: string = localStorage.getItem(this.keyStorage) as string;

    if (this.encryptUser && userStorage) {
      try {
        let userDecrypt: string = CryptoJSHelper.decrypt(
          this.encoder,
          userStorage,
        );

        return JSON.parse(userDecrypt) as UserCredentials;
      } catch (e) {
        this.removeFromStorage();
        window.location.replace(`${window.location.origin}`);
        return null;
      }
    }

    return JSON.parse(userStorage) as UserCredentials;
  }

  public removeFromStorage() {
    localStorage.removeItem(this.keyStorage);
    localStorage.removeItem(this.keyStorageTracking);
    authTokenStorage.removeFromStorage();
    HttpAxiosRequest.refreshToken('', '');
    HttpAxiosRequestPublicBases.refreshToken('', '');
  }
  
  public subscribe(callback: () => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  private notifySubscribers() {
    this.subscribers.forEach(callback => callback());
  }
  
  public setFullName(fullName: string) {
    let user: UserCredentials | null = this.get();

    if (!user) return;

    const [firstName, lastName, displayName] = personFormatter.getFirstLastAndDisplayNameFromFullName(fullName);
    
    let userCredentials: UserCredentials = {
      ...user,
      fullName: fullName,
      firstName: firstName,
      lastName: lastName,
      displayName: displayName,
    };

    this.saveStorage(userCredentials);
  }

  public setDataConfirmed(
    confirmedMail: boolean,
    confirmedPhoneNumber: boolean,
    confirmedPerson: boolean,
  ) {
    let user: UserCredentials | null = this.get();

    if (!user) return;

    let userCredentials: UserCredentials = {
      ...user,
      confirmedMail: confirmedMail,
      confirmedPhoneNumber: confirmedPhoneNumber,
      confirmedPerson: confirmedPerson,
      lackConfirmation:
        !confirmedMail || !confirmedPhoneNumber || !confirmedPerson,
    };

    this.saveStorage(userCredentials);
  }

  public setValidatedIdentity(validatedIdentity: boolean) {
    let user: UserCredentials | null = this.get();

    if (!user) return;

    let userCredentials: UserCredentials = {
      ...user,
      hasValidatedIdentity: validatedIdentity,
      validationIdentityStatusCode: validatedIdentity ? 4 : 3,
    };

    this.saveStorage(userCredentials);
  }
  
  public setOffererSlug(slug: string) {
    localStorage.setItem('offererGroupSlug', slug)
  }
  
  public getOffererSlug() {
    return localStorage.getItem('offererGroupSlug')
  }

  public setValidatedIdentityCode(validatedIdentityCode: number) {
    let user: UserCredentials | null = this.get();

    if (!user) return;

    let userCredentials: UserCredentials = {
        ...user,
        hasValidatedIdentity: validatedIdentityCode === ValidationStatesType.Validated, 
        validationIdentityStatusCode: validatedIdentityCode,
    };

    this.saveStorage(userCredentials);
    this.notifySubscribers();
  }
  
  public skipFirstLogin() {
      let user: UserCredentials | null = this.get();

      if (!user) return;

      let userCredentials: UserCredentials = {
          ...user,
          isFirstLogin: false
      };
      this.saveStorage(userCredentials);
  }

  public setDataNamesAndReturn() : [string, string, string] {
    let user: UserCredentials | null = this.get();
    
    if (!user) return ['', '', ''];

    const [firstName, lastName, displayName] = personFormatter.getFirstLastAndDisplayNameFromFullName(user.fullName);

    let userCredentials: UserCredentials = {
      ...user,
      firstName: firstName,
      lastName: lastName,
      displayName: displayName,
    };
    this.saveStorage(userCredentials);
    
    return [firstName, lastName, displayName];
  }
  
  public getFullName() {
    const fullName = this.get()?.fullName;
    return fullName ? fullName : 'Usuario Desconocido'; //puse esto para tener un fallback, sino rompia toda la app
  }
  
  public getInitialsName() {
    let user: UserCredentials | null = this.get();
    if (!user) return "";
    
    if (user.firstName && !!user.firstName.length && user.lastName && !!user.lastName.length)
      return `${user.firstName[0]}${user.lastName[0]}`;
    
    return "";
  }

  public getFirstName() {
    let user: UserCredentials | null = this.get();

    if (!user) return undefined;

    if (!user.firstName && !!user.fullName) {
      const [firstName, , ] = this.setDataNamesAndReturn();

      return firstName;
    }

    return user.firstName ?? '';
  }

  public getLastName() {
    let user: UserCredentials | null = this.get();

    if (!user) return undefined;

    if (!user.lastName && !!user.fullName) {
      const [, lastName, ] = this.setDataNamesAndReturn();

      return lastName;
    }

    return user.lastName ?? '';
  }
  
  public getDisplayName() {
    let user: UserCredentials | null = this.get();
    
    if (!user) return 'Usuario Desconocido';
    
    if (!user.displayName && !!user.fullName) {
      const [firstName, , displayName] = this.setDataNamesAndReturn();

      return displayName || user.fullName;
    }
    
    return user.displayName ?? user.fullName ?? 'Usuario Desconocido';
  }
  
  public getCuit() {
    return this.get()?.cuit;
  }
  public getUserId() {
    return this.get()?.userId;
  }
  public getUserType() {
    return this.get()?.userType;
  }
  public getProfileId() {
    return this.get()?.profileId;
  }
  public getProfileIds() {
    return this.get()?.profileIds;
  }
  public getUserMail() {
    return this.get()?.mail;
  }
  public getValidatedIdentityCode() {
    return this.get()?.validationIdentityStatusCode;
  }

  public getMenuLayoutType(): MenuLayoutType {
    const user: UserCredentials | null = this.get();

    let layoutType = MenuLayoutType.Home;

    if (user) {
      const moduleUserType = user.userType;

      switch (moduleUserType) {
        case Module.Offerer:
          layoutType = MenuLayoutType.OffererHome;
          break;
        case Module.Internal:
          layoutType = MenuLayoutType.InternalHome;
          break;
      }
    }

    return layoutType;
  }

  public isLogged() {
    return this.get() !== null;
  }

  public isLackConfirmation() {
    const user = this.get();
    return !user || user.lackConfirmation;
  }

  public hasValidatedIdentity() {
    const user = this.get();
    return (
      !user ||
      user.validationIdentityStatusCode === ValidationStatesType.Validated
    );
  }

  public hasTaxActivity() {
    const user = this.get();
    return !!user && user.hasTaxActivity;
  }

  public isFirstEntry() {
    let user: UserCredentials | null = this.get();
    let userFirstEntry: boolean = user?.firstEntry ?? false;

    if (user && userFirstEntry) {
      user.firstEntry = false;
      this.saveStorage(user);
    }

    return userFirstEntry;
  }

  public mustChangePassword() {
    return this.get()?.mustChangePassword || false;
  }
  public setMustChangePassword(mustChangePassword: boolean) {
    let user: UserCredentials | null = this.get();

    if (!user) return;

    let userCredentials: UserCredentials = {
      ...user,
      mustChangePassword: mustChangePassword,
    };

    this.saveStorage(userCredentials);
  }

  private saveStorage(userCredentials: UserCredentials) {
    if (this.encryptUser)
      localStorage.setItem(
        this.keyStorage,
        CryptoJSHelper.encrypt(this.encoder, JSON.stringify(userCredentials)),
      );
    else localStorage.setItem(this.keyStorage, JSON.stringify(userCredentials));
  }
}

export const userStorage = new UserStorage();
