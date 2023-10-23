import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace turbotin. */
export namespace turbotin {

    /** Severity enum. */
    enum Severity {
        info = 0,
        error = 1,
        warning = 2,
        success = 3
    }

    /** Store enum. */
    enum Store {
        s_just4him = 0,
        s_4noggins = 1,
        s_tophat = 2,
        s_cupojoes = 3,
        s_marscigars = 4,
        s_milan = 5,
        s_smokingpipes = 6,
        s_niceashcigars = 7,
        s_iwanries = 8,
        s_mccranies = 9,
        s_boswell = 10,
        s_lilbrown = 11,
        s_windycitycigars = 12,
        s_bnb = 13,
        s_thebriary = 14,
        s_kbven = 15,
        s_tobaccopipes = 16,
        s_kingsmoking = 17,
        s_countrysquire = 18,
        s_pipesandcigars = 19,
        s_watchcitycigar = 20,
        s_thestorytellers = 21,
        s_payless = 22,
        s_hilandscigars = 23,
        s_pipeandleaf = 24,
        s_cigarsintl = 25,
        s_eacarey = 26,
        s_pipenook = 27,
        s_wilke = 28,
        s_smokershaven = 29,
        s_blackcatcigars = 30,
        s_ansteads = 31,
        s_cdmcigars = 32,
        s_ljperetti = 33,
        s_outwest = 34
    }

    /** Properties of a ResponseMeta. */
    interface IResponseMeta {

        /** ResponseMeta severity */
        severity?: (turbotin.Severity|null);

        /** ResponseMeta msg */
        msg?: (string|null);
    }

    /** Represents a ResponseMeta. */
    class ResponseMeta implements IResponseMeta {

        /**
         * Constructs a new ResponseMeta.
         * @param [properties] Properties to set
         */
        constructor(properties?: turbotin.IResponseMeta);

        /** ResponseMeta severity. */
        public severity: turbotin.Severity;

        /** ResponseMeta msg. */
        public msg: string;

        /**
         * Creates a new ResponseMeta instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ResponseMeta instance
         */
        public static create(properties?: turbotin.IResponseMeta): turbotin.ResponseMeta;

        /**
         * Encodes the specified ResponseMeta message. Does not implicitly {@link turbotin.ResponseMeta.verify|verify} messages.
         * @param message ResponseMeta message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: turbotin.IResponseMeta, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ResponseMeta message, length delimited. Does not implicitly {@link turbotin.ResponseMeta.verify|verify} messages.
         * @param message ResponseMeta message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: turbotin.IResponseMeta, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ResponseMeta message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ResponseMeta
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): turbotin.ResponseMeta;

        /**
         * Decodes a ResponseMeta message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ResponseMeta
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): turbotin.ResponseMeta;

        /**
         * Verifies a ResponseMeta message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ResponseMeta message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ResponseMeta
         */
        public static fromObject(object: { [k: string]: any }): turbotin.ResponseMeta;

        /**
         * Creates a plain object from a ResponseMeta message. Also converts values to other types if specified.
         * @param message ResponseMeta
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: turbotin.ResponseMeta, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ResponseMeta to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ResponseMeta
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an EmptyResponse. */
    interface IEmptyResponse {

        /** EmptyResponse meta */
        meta?: (turbotin.IResponseMeta|null);
    }

    /** Represents an EmptyResponse. */
    class EmptyResponse implements IEmptyResponse {

        /**
         * Constructs a new EmptyResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: turbotin.IEmptyResponse);

        /** EmptyResponse meta. */
        public meta?: (turbotin.IResponseMeta|null);

        /**
         * Creates a new EmptyResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns EmptyResponse instance
         */
        public static create(properties?: turbotin.IEmptyResponse): turbotin.EmptyResponse;

        /**
         * Encodes the specified EmptyResponse message. Does not implicitly {@link turbotin.EmptyResponse.verify|verify} messages.
         * @param message EmptyResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: turbotin.IEmptyResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified EmptyResponse message, length delimited. Does not implicitly {@link turbotin.EmptyResponse.verify|verify} messages.
         * @param message EmptyResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: turbotin.IEmptyResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an EmptyResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns EmptyResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): turbotin.EmptyResponse;

        /**
         * Decodes an EmptyResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns EmptyResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): turbotin.EmptyResponse;

        /**
         * Verifies an EmptyResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an EmptyResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns EmptyResponse
         */
        public static fromObject(object: { [k: string]: any }): turbotin.EmptyResponse;

        /**
         * Creates a plain object from an EmptyResponse message. Also converts values to other types if specified.
         * @param message EmptyResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: turbotin.EmptyResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this EmptyResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for EmptyResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an EmptyArgs. */
    interface IEmptyArgs {
    }

    /** Represents an EmptyArgs. */
    class EmptyArgs implements IEmptyArgs {

        /**
         * Constructs a new EmptyArgs.
         * @param [properties] Properties to set
         */
        constructor(properties?: turbotin.IEmptyArgs);

        /**
         * Creates a new EmptyArgs instance using the specified properties.
         * @param [properties] Properties to set
         * @returns EmptyArgs instance
         */
        public static create(properties?: turbotin.IEmptyArgs): turbotin.EmptyArgs;

        /**
         * Encodes the specified EmptyArgs message. Does not implicitly {@link turbotin.EmptyArgs.verify|verify} messages.
         * @param message EmptyArgs message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: turbotin.IEmptyArgs, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified EmptyArgs message, length delimited. Does not implicitly {@link turbotin.EmptyArgs.verify|verify} messages.
         * @param message EmptyArgs message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: turbotin.IEmptyArgs, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an EmptyArgs message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns EmptyArgs
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): turbotin.EmptyArgs;

        /**
         * Decodes an EmptyArgs message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns EmptyArgs
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): turbotin.EmptyArgs;

        /**
         * Verifies an EmptyArgs message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an EmptyArgs message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns EmptyArgs
         */
        public static fromObject(object: { [k: string]: any }): turbotin.EmptyArgs;

        /**
         * Creates a plain object from an EmptyArgs message. Also converts values to other types if specified.
         * @param message EmptyArgs
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: turbotin.EmptyArgs, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this EmptyArgs to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for EmptyArgs
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Represents an Auth */
    class Auth extends $protobuf.rpc.Service {

        /**
         * Constructs a new Auth service.
         * @param rpcImpl RPC implementation
         * @param [requestDelimited=false] Whether requests are length-delimited
         * @param [responseDelimited=false] Whether responses are length-delimited
         */
        constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

        /**
         * Creates new Auth service using the specified rpc implementation.
         * @param rpcImpl RPC implementation
         * @param [requestDelimited=false] Whether requests are length-delimited
         * @param [responseDelimited=false] Whether responses are length-delimited
         * @returns RPC service. Useful where requests and/or responses are streamed.
         */
        public static create(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): Auth;

        /**
         * Calls GetCurrentUser.
         * @param request EmptyArgs message or plain object
         * @param callback Node-style callback called with the error, if any, and User
         */
        public getCurrentUser(request: turbotin.IEmptyArgs, callback: turbotin.Auth.GetCurrentUserCallback): void;

        /**
         * Calls GetCurrentUser.
         * @param request EmptyArgs message or plain object
         * @returns Promise
         */
        public getCurrentUser(request: turbotin.IEmptyArgs): Promise<turbotin.User>;

        /**
         * Calls SignUp.
         * @param request AuthArgs message or plain object
         * @param callback Node-style callback called with the error, if any, and EmptyResponse
         */
        public signUp(request: turbotin.IAuthArgs, callback: turbotin.Auth.SignUpCallback): void;

        /**
         * Calls SignUp.
         * @param request AuthArgs message or plain object
         * @returns Promise
         */
        public signUp(request: turbotin.IAuthArgs): Promise<turbotin.EmptyResponse>;

        /**
         * Calls Login.
         * @param request AuthArgs message or plain object
         * @param callback Node-style callback called with the error, if any, and EmptyResponse
         */
        public login(request: turbotin.IAuthArgs, callback: turbotin.Auth.LoginCallback): void;

        /**
         * Calls Login.
         * @param request AuthArgs message or plain object
         * @returns Promise
         */
        public login(request: turbotin.IAuthArgs): Promise<turbotin.EmptyResponse>;

        /**
         * Calls Logout.
         * @param request EmptyArgs message or plain object
         * @param callback Node-style callback called with the error, if any, and EmptyResponse
         */
        public logout(request: turbotin.IEmptyArgs, callback: turbotin.Auth.LogoutCallback): void;

        /**
         * Calls Logout.
         * @param request EmptyArgs message or plain object
         * @returns Promise
         */
        public logout(request: turbotin.IEmptyArgs): Promise<turbotin.EmptyResponse>;
    }

    namespace Auth {

        /**
         * Callback as used by {@link turbotin.Auth#getCurrentUser}.
         * @param error Error, if any
         * @param [response] User
         */
        type GetCurrentUserCallback = (error: (Error|null), response?: turbotin.User) => void;

        /**
         * Callback as used by {@link turbotin.Auth#signUp}.
         * @param error Error, if any
         * @param [response] EmptyResponse
         */
        type SignUpCallback = (error: (Error|null), response?: turbotin.EmptyResponse) => void;

        /**
         * Callback as used by {@link turbotin.Auth#login}.
         * @param error Error, if any
         * @param [response] EmptyResponse
         */
        type LoginCallback = (error: (Error|null), response?: turbotin.EmptyResponse) => void;

        /**
         * Callback as used by {@link turbotin.Auth#logout}.
         * @param error Error, if any
         * @param [response] EmptyResponse
         */
        type LogoutCallback = (error: (Error|null), response?: turbotin.EmptyResponse) => void;
    }

    /** Properties of an AuthArgs. */
    interface IAuthArgs {

        /** AuthArgs meta */
        meta?: (turbotin.IResponseMeta|null);

        /** AuthArgs email */
        email?: (string|null);

        /** AuthArgs password */
        password?: (string|null);

        /** AuthArgs rememberMe */
        rememberMe?: (boolean|null);
    }

    /** Represents an AuthArgs. */
    class AuthArgs implements IAuthArgs {

        /**
         * Constructs a new AuthArgs.
         * @param [properties] Properties to set
         */
        constructor(properties?: turbotin.IAuthArgs);

        /** AuthArgs meta. */
        public meta?: (turbotin.IResponseMeta|null);

        /** AuthArgs email. */
        public email: string;

        /** AuthArgs password. */
        public password: string;

        /** AuthArgs rememberMe. */
        public rememberMe: boolean;

        /**
         * Creates a new AuthArgs instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AuthArgs instance
         */
        public static create(properties?: turbotin.IAuthArgs): turbotin.AuthArgs;

        /**
         * Encodes the specified AuthArgs message. Does not implicitly {@link turbotin.AuthArgs.verify|verify} messages.
         * @param message AuthArgs message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: turbotin.IAuthArgs, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AuthArgs message, length delimited. Does not implicitly {@link turbotin.AuthArgs.verify|verify} messages.
         * @param message AuthArgs message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: turbotin.IAuthArgs, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AuthArgs message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AuthArgs
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): turbotin.AuthArgs;

        /**
         * Decodes an AuthArgs message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AuthArgs
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): turbotin.AuthArgs;

        /**
         * Verifies an AuthArgs message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AuthArgs message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AuthArgs
         */
        public static fromObject(object: { [k: string]: any }): turbotin.AuthArgs;

        /**
         * Creates a plain object from an AuthArgs message. Also converts values to other types if specified.
         * @param message AuthArgs
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: turbotin.AuthArgs, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AuthArgs to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for AuthArgs
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a User. */
    interface IUser {

        /** User meta */
        meta?: (turbotin.IResponseMeta|null);

        /** User email */
        email?: (string|null);

        /** User emailVerified */
        emailVerified?: (boolean|null);
    }

    /** Represents a User. */
    class User implements IUser {

        /**
         * Constructs a new User.
         * @param [properties] Properties to set
         */
        constructor(properties?: turbotin.IUser);

        /** User meta. */
        public meta?: (turbotin.IResponseMeta|null);

        /** User email. */
        public email: string;

        /** User emailVerified. */
        public emailVerified: boolean;

        /**
         * Creates a new User instance using the specified properties.
         * @param [properties] Properties to set
         * @returns User instance
         */
        public static create(properties?: turbotin.IUser): turbotin.User;

        /**
         * Encodes the specified User message. Does not implicitly {@link turbotin.User.verify|verify} messages.
         * @param message User message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: turbotin.IUser, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified User message, length delimited. Does not implicitly {@link turbotin.User.verify|verify} messages.
         * @param message User message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: turbotin.IUser, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a User message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns User
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): turbotin.User;

        /**
         * Decodes a User message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns User
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): turbotin.User;

        /**
         * Verifies a User message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a User message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns User
         */
        public static fromObject(object: { [k: string]: any }): turbotin.User;

        /**
         * Creates a plain object from a User message. Also converts values to other types if specified.
         * @param message User
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: turbotin.User, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this User to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for User
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Represents a Public */
    class Public extends $protobuf.rpc.Service {

        /**
         * Constructs a new Public service.
         * @param rpcImpl RPC implementation
         * @param [requestDelimited=false] Whether requests are length-delimited
         * @param [responseDelimited=false] Whether responses are length-delimited
         */
        constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

        /**
         * Creates new Public service using the specified rpc implementation.
         * @param rpcImpl RPC implementation
         * @param [requestDelimited=false] Whether requests are length-delimited
         * @param [responseDelimited=false] Whether responses are length-delimited
         * @returns RPC service. Useful where requests and/or responses are streamed.
         */
        public static create(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): Public;

        /**
         * Calls TodaysTobaccos.
         * @param request EmptyArgs message or plain object
         * @param callback Node-style callback called with the error, if any, and ObsTobaccoList
         */
        public todaysTobaccos(request: turbotin.IEmptyArgs, callback: turbotin.Public.TodaysTobaccosCallback): void;

        /**
         * Calls TodaysTobaccos.
         * @param request EmptyArgs message or plain object
         * @returns Promise
         */
        public todaysTobaccos(request: turbotin.IEmptyArgs): Promise<turbotin.ObsTobaccoList>;
    }

    namespace Public {

        /**
         * Callback as used by {@link turbotin.Public#todaysTobaccos}.
         * @param error Error, if any
         * @param [response] ObsTobaccoList
         */
        type TodaysTobaccosCallback = (error: (Error|null), response?: turbotin.ObsTobaccoList) => void;
    }

    /** Properties of an ObsTobacco. */
    interface IObsTobacco {

        /** ObsTobacco meta */
        meta?: (turbotin.IResponseMeta|null);

        /** ObsTobacco item */
        item?: (string|null);

        /** ObsTobacco store */
        store?: (turbotin.Store|null);

        /** ObsTobacco link */
        link?: (string|null);

        /** ObsTobacco priceStr */
        priceStr?: (string|null);

        /** ObsTobacco time */
        time?: (google.protobuf.ITimestamp|null);

        /** ObsTobacco inStock */
        inStock?: (boolean|null);

        /** ObsTobacco tobaccoId */
        tobaccoId?: (number|null);
    }

    /** Represents an ObsTobacco. */
    class ObsTobacco implements IObsTobacco {

        /**
         * Constructs a new ObsTobacco.
         * @param [properties] Properties to set
         */
        constructor(properties?: turbotin.IObsTobacco);

        /** ObsTobacco meta. */
        public meta?: (turbotin.IResponseMeta|null);

        /** ObsTobacco item. */
        public item: string;

        /** ObsTobacco store. */
        public store: turbotin.Store;

        /** ObsTobacco link. */
        public link: string;

        /** ObsTobacco priceStr. */
        public priceStr: string;

        /** ObsTobacco time. */
        public time?: (google.protobuf.ITimestamp|null);

        /** ObsTobacco inStock. */
        public inStock: boolean;

        /** ObsTobacco tobaccoId. */
        public tobaccoId: number;

        /**
         * Creates a new ObsTobacco instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ObsTobacco instance
         */
        public static create(properties?: turbotin.IObsTobacco): turbotin.ObsTobacco;

        /**
         * Encodes the specified ObsTobacco message. Does not implicitly {@link turbotin.ObsTobacco.verify|verify} messages.
         * @param message ObsTobacco message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: turbotin.IObsTobacco, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ObsTobacco message, length delimited. Does not implicitly {@link turbotin.ObsTobacco.verify|verify} messages.
         * @param message ObsTobacco message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: turbotin.IObsTobacco, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an ObsTobacco message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ObsTobacco
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): turbotin.ObsTobacco;

        /**
         * Decodes an ObsTobacco message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ObsTobacco
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): turbotin.ObsTobacco;

        /**
         * Verifies an ObsTobacco message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an ObsTobacco message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ObsTobacco
         */
        public static fromObject(object: { [k: string]: any }): turbotin.ObsTobacco;

        /**
         * Creates a plain object from an ObsTobacco message. Also converts values to other types if specified.
         * @param message ObsTobacco
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: turbotin.ObsTobacco, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ObsTobacco to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ObsTobacco
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an ObsTobaccoList. */
    interface IObsTobaccoList {

        /** ObsTobaccoList meta */
        meta?: (turbotin.IResponseMeta|null);

        /** ObsTobaccoList items */
        items?: (turbotin.IObsTobacco[]|null);
    }

    /** Represents an ObsTobaccoList. */
    class ObsTobaccoList implements IObsTobaccoList {

        /**
         * Constructs a new ObsTobaccoList.
         * @param [properties] Properties to set
         */
        constructor(properties?: turbotin.IObsTobaccoList);

        /** ObsTobaccoList meta. */
        public meta?: (turbotin.IResponseMeta|null);

        /** ObsTobaccoList items. */
        public items: turbotin.IObsTobacco[];

        /**
         * Creates a new ObsTobaccoList instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ObsTobaccoList instance
         */
        public static create(properties?: turbotin.IObsTobaccoList): turbotin.ObsTobaccoList;

        /**
         * Encodes the specified ObsTobaccoList message. Does not implicitly {@link turbotin.ObsTobaccoList.verify|verify} messages.
         * @param message ObsTobaccoList message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: turbotin.IObsTobaccoList, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ObsTobaccoList message, length delimited. Does not implicitly {@link turbotin.ObsTobaccoList.verify|verify} messages.
         * @param message ObsTobaccoList message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: turbotin.IObsTobaccoList, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an ObsTobaccoList message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ObsTobaccoList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): turbotin.ObsTobaccoList;

        /**
         * Decodes an ObsTobaccoList message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ObsTobaccoList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): turbotin.ObsTobaccoList;

        /**
         * Verifies an ObsTobaccoList message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an ObsTobaccoList message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ObsTobaccoList
         */
        public static fromObject(object: { [k: string]: any }): turbotin.ObsTobaccoList;

        /**
         * Creates a plain object from an ObsTobaccoList message. Also converts values to other types if specified.
         * @param message ObsTobaccoList
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: turbotin.ObsTobaccoList, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ObsTobaccoList to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ObsTobaccoList
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }
}

/** Namespace google. */
export namespace google {

    /** Namespace protobuf. */
    namespace protobuf {

        /** Properties of a Timestamp. */
        interface ITimestamp {

            /** Timestamp seconds */
            seconds?: (number|Long|null);

            /** Timestamp nanos */
            nanos?: (number|null);
        }

        /** Represents a Timestamp. */
        class Timestamp implements ITimestamp {

            /**
             * Constructs a new Timestamp.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.ITimestamp);

            /** Timestamp seconds. */
            public seconds: (number|Long);

            /** Timestamp nanos. */
            public nanos: number;

            /**
             * Creates a new Timestamp instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Timestamp instance
             */
            public static create(properties?: google.protobuf.ITimestamp): google.protobuf.Timestamp;

            /**
             * Encodes the specified Timestamp message. Does not implicitly {@link google.protobuf.Timestamp.verify|verify} messages.
             * @param message Timestamp message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.ITimestamp, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Timestamp message, length delimited. Does not implicitly {@link google.protobuf.Timestamp.verify|verify} messages.
             * @param message Timestamp message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.ITimestamp, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Timestamp message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Timestamp
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.Timestamp;

            /**
             * Decodes a Timestamp message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Timestamp
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.Timestamp;

            /**
             * Verifies a Timestamp message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Timestamp message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Timestamp
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.Timestamp;

            /**
             * Creates a plain object from a Timestamp message. Also converts values to other types if specified.
             * @param message Timestamp
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.Timestamp, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Timestamp to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Timestamp
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }
    }
}
