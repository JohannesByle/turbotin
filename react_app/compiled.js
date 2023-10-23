/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.turbotin = (function() {

    /**
     * Namespace turbotin.
     * @exports turbotin
     * @namespace
     */
    var turbotin = {};

    /**
     * Severity enum.
     * @name turbotin.Severity
     * @enum {number}
     * @property {number} info=0 info value
     * @property {number} error=1 error value
     * @property {number} warning=2 warning value
     * @property {number} success=3 success value
     */
    turbotin.Severity = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "info"] = 0;
        values[valuesById[1] = "error"] = 1;
        values[valuesById[2] = "warning"] = 2;
        values[valuesById[3] = "success"] = 3;
        return values;
    })();

    /**
     * Store enum.
     * @name turbotin.Store
     * @enum {number}
     * @property {number} s_just4him=0 s_just4him value
     * @property {number} s_4noggins=1 s_4noggins value
     * @property {number} s_tophat=2 s_tophat value
     * @property {number} s_cupojoes=3 s_cupojoes value
     * @property {number} s_marscigars=4 s_marscigars value
     * @property {number} s_milan=5 s_milan value
     * @property {number} s_smokingpipes=6 s_smokingpipes value
     * @property {number} s_niceashcigars=7 s_niceashcigars value
     * @property {number} s_iwanries=8 s_iwanries value
     * @property {number} s_mccranies=9 s_mccranies value
     * @property {number} s_boswell=10 s_boswell value
     * @property {number} s_lilbrown=11 s_lilbrown value
     * @property {number} s_windycitycigars=12 s_windycitycigars value
     * @property {number} s_bnb=13 s_bnb value
     * @property {number} s_thebriary=14 s_thebriary value
     * @property {number} s_kbven=15 s_kbven value
     * @property {number} s_tobaccopipes=16 s_tobaccopipes value
     * @property {number} s_kingsmoking=17 s_kingsmoking value
     * @property {number} s_countrysquire=18 s_countrysquire value
     * @property {number} s_pipesandcigars=19 s_pipesandcigars value
     * @property {number} s_watchcitycigar=20 s_watchcitycigar value
     * @property {number} s_thestorytellers=21 s_thestorytellers value
     * @property {number} s_payless=22 s_payless value
     * @property {number} s_hilandscigars=23 s_hilandscigars value
     * @property {number} s_pipeandleaf=24 s_pipeandleaf value
     * @property {number} s_cigarsintl=25 s_cigarsintl value
     * @property {number} s_eacarey=26 s_eacarey value
     * @property {number} s_pipenook=27 s_pipenook value
     * @property {number} s_wilke=28 s_wilke value
     * @property {number} s_smokershaven=29 s_smokershaven value
     * @property {number} s_blackcatcigars=30 s_blackcatcigars value
     * @property {number} s_ansteads=31 s_ansteads value
     * @property {number} s_cdmcigars=32 s_cdmcigars value
     * @property {number} s_ljperetti=33 s_ljperetti value
     * @property {number} s_outwest=34 s_outwest value
     */
    turbotin.Store = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "s_just4him"] = 0;
        values[valuesById[1] = "s_4noggins"] = 1;
        values[valuesById[2] = "s_tophat"] = 2;
        values[valuesById[3] = "s_cupojoes"] = 3;
        values[valuesById[4] = "s_marscigars"] = 4;
        values[valuesById[5] = "s_milan"] = 5;
        values[valuesById[6] = "s_smokingpipes"] = 6;
        values[valuesById[7] = "s_niceashcigars"] = 7;
        values[valuesById[8] = "s_iwanries"] = 8;
        values[valuesById[9] = "s_mccranies"] = 9;
        values[valuesById[10] = "s_boswell"] = 10;
        values[valuesById[11] = "s_lilbrown"] = 11;
        values[valuesById[12] = "s_windycitycigars"] = 12;
        values[valuesById[13] = "s_bnb"] = 13;
        values[valuesById[14] = "s_thebriary"] = 14;
        values[valuesById[15] = "s_kbven"] = 15;
        values[valuesById[16] = "s_tobaccopipes"] = 16;
        values[valuesById[17] = "s_kingsmoking"] = 17;
        values[valuesById[18] = "s_countrysquire"] = 18;
        values[valuesById[19] = "s_pipesandcigars"] = 19;
        values[valuesById[20] = "s_watchcitycigar"] = 20;
        values[valuesById[21] = "s_thestorytellers"] = 21;
        values[valuesById[22] = "s_payless"] = 22;
        values[valuesById[23] = "s_hilandscigars"] = 23;
        values[valuesById[24] = "s_pipeandleaf"] = 24;
        values[valuesById[25] = "s_cigarsintl"] = 25;
        values[valuesById[26] = "s_eacarey"] = 26;
        values[valuesById[27] = "s_pipenook"] = 27;
        values[valuesById[28] = "s_wilke"] = 28;
        values[valuesById[29] = "s_smokershaven"] = 29;
        values[valuesById[30] = "s_blackcatcigars"] = 30;
        values[valuesById[31] = "s_ansteads"] = 31;
        values[valuesById[32] = "s_cdmcigars"] = 32;
        values[valuesById[33] = "s_ljperetti"] = 33;
        values[valuesById[34] = "s_outwest"] = 34;
        return values;
    })();

    turbotin.ResponseMeta = (function() {

        /**
         * Properties of a ResponseMeta.
         * @memberof turbotin
         * @interface IResponseMeta
         * @property {turbotin.Severity|null} [severity] ResponseMeta severity
         * @property {string|null} [msg] ResponseMeta msg
         */

        /**
         * Constructs a new ResponseMeta.
         * @memberof turbotin
         * @classdesc Represents a ResponseMeta.
         * @implements IResponseMeta
         * @constructor
         * @param {turbotin.IResponseMeta=} [properties] Properties to set
         */
        function ResponseMeta(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ResponseMeta severity.
         * @member {turbotin.Severity} severity
         * @memberof turbotin.ResponseMeta
         * @instance
         */
        ResponseMeta.prototype.severity = 0;

        /**
         * ResponseMeta msg.
         * @member {string} msg
         * @memberof turbotin.ResponseMeta
         * @instance
         */
        ResponseMeta.prototype.msg = "";

        /**
         * Creates a new ResponseMeta instance using the specified properties.
         * @function create
         * @memberof turbotin.ResponseMeta
         * @static
         * @param {turbotin.IResponseMeta=} [properties] Properties to set
         * @returns {turbotin.ResponseMeta} ResponseMeta instance
         */
        ResponseMeta.create = function create(properties) {
            return new ResponseMeta(properties);
        };

        /**
         * Encodes the specified ResponseMeta message. Does not implicitly {@link turbotin.ResponseMeta.verify|verify} messages.
         * @function encode
         * @memberof turbotin.ResponseMeta
         * @static
         * @param {turbotin.IResponseMeta} message ResponseMeta message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ResponseMeta.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.severity != null && Object.hasOwnProperty.call(message, "severity"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.severity);
            if (message.msg != null && Object.hasOwnProperty.call(message, "msg"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.msg);
            return writer;
        };

        /**
         * Encodes the specified ResponseMeta message, length delimited. Does not implicitly {@link turbotin.ResponseMeta.verify|verify} messages.
         * @function encodeDelimited
         * @memberof turbotin.ResponseMeta
         * @static
         * @param {turbotin.IResponseMeta} message ResponseMeta message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ResponseMeta.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ResponseMeta message from the specified reader or buffer.
         * @function decode
         * @memberof turbotin.ResponseMeta
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {turbotin.ResponseMeta} ResponseMeta
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ResponseMeta.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.turbotin.ResponseMeta();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.severity = reader.int32();
                        break;
                    }
                case 2: {
                        message.msg = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ResponseMeta message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof turbotin.ResponseMeta
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {turbotin.ResponseMeta} ResponseMeta
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ResponseMeta.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ResponseMeta message.
         * @function verify
         * @memberof turbotin.ResponseMeta
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ResponseMeta.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.severity != null && message.hasOwnProperty("severity"))
                switch (message.severity) {
                default:
                    return "severity: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.msg != null && message.hasOwnProperty("msg"))
                if (!$util.isString(message.msg))
                    return "msg: string expected";
            return null;
        };

        /**
         * Creates a ResponseMeta message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof turbotin.ResponseMeta
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {turbotin.ResponseMeta} ResponseMeta
         */
        ResponseMeta.fromObject = function fromObject(object) {
            if (object instanceof $root.turbotin.ResponseMeta)
                return object;
            var message = new $root.turbotin.ResponseMeta();
            switch (object.severity) {
            default:
                if (typeof object.severity === "number") {
                    message.severity = object.severity;
                    break;
                }
                break;
            case "info":
            case 0:
                message.severity = 0;
                break;
            case "error":
            case 1:
                message.severity = 1;
                break;
            case "warning":
            case 2:
                message.severity = 2;
                break;
            case "success":
            case 3:
                message.severity = 3;
                break;
            }
            if (object.msg != null)
                message.msg = String(object.msg);
            return message;
        };

        /**
         * Creates a plain object from a ResponseMeta message. Also converts values to other types if specified.
         * @function toObject
         * @memberof turbotin.ResponseMeta
         * @static
         * @param {turbotin.ResponseMeta} message ResponseMeta
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ResponseMeta.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.severity = options.enums === String ? "info" : 0;
                object.msg = "";
            }
            if (message.severity != null && message.hasOwnProperty("severity"))
                object.severity = options.enums === String ? $root.turbotin.Severity[message.severity] === undefined ? message.severity : $root.turbotin.Severity[message.severity] : message.severity;
            if (message.msg != null && message.hasOwnProperty("msg"))
                object.msg = message.msg;
            return object;
        };

        /**
         * Converts this ResponseMeta to JSON.
         * @function toJSON
         * @memberof turbotin.ResponseMeta
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ResponseMeta.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ResponseMeta
         * @function getTypeUrl
         * @memberof turbotin.ResponseMeta
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ResponseMeta.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/turbotin.ResponseMeta";
        };

        return ResponseMeta;
    })();

    turbotin.EmptyResponse = (function() {

        /**
         * Properties of an EmptyResponse.
         * @memberof turbotin
         * @interface IEmptyResponse
         * @property {turbotin.IResponseMeta|null} [meta] EmptyResponse meta
         */

        /**
         * Constructs a new EmptyResponse.
         * @memberof turbotin
         * @classdesc Represents an EmptyResponse.
         * @implements IEmptyResponse
         * @constructor
         * @param {turbotin.IEmptyResponse=} [properties] Properties to set
         */
        function EmptyResponse(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * EmptyResponse meta.
         * @member {turbotin.IResponseMeta|null|undefined} meta
         * @memberof turbotin.EmptyResponse
         * @instance
         */
        EmptyResponse.prototype.meta = null;

        /**
         * Creates a new EmptyResponse instance using the specified properties.
         * @function create
         * @memberof turbotin.EmptyResponse
         * @static
         * @param {turbotin.IEmptyResponse=} [properties] Properties to set
         * @returns {turbotin.EmptyResponse} EmptyResponse instance
         */
        EmptyResponse.create = function create(properties) {
            return new EmptyResponse(properties);
        };

        /**
         * Encodes the specified EmptyResponse message. Does not implicitly {@link turbotin.EmptyResponse.verify|verify} messages.
         * @function encode
         * @memberof turbotin.EmptyResponse
         * @static
         * @param {turbotin.IEmptyResponse} message EmptyResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EmptyResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.meta != null && Object.hasOwnProperty.call(message, "meta"))
                $root.turbotin.ResponseMeta.encode(message.meta, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified EmptyResponse message, length delimited. Does not implicitly {@link turbotin.EmptyResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof turbotin.EmptyResponse
         * @static
         * @param {turbotin.IEmptyResponse} message EmptyResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EmptyResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an EmptyResponse message from the specified reader or buffer.
         * @function decode
         * @memberof turbotin.EmptyResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {turbotin.EmptyResponse} EmptyResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EmptyResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.turbotin.EmptyResponse();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.meta = $root.turbotin.ResponseMeta.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an EmptyResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof turbotin.EmptyResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {turbotin.EmptyResponse} EmptyResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EmptyResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an EmptyResponse message.
         * @function verify
         * @memberof turbotin.EmptyResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        EmptyResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.meta != null && message.hasOwnProperty("meta")) {
                var error = $root.turbotin.ResponseMeta.verify(message.meta);
                if (error)
                    return "meta." + error;
            }
            return null;
        };

        /**
         * Creates an EmptyResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof turbotin.EmptyResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {turbotin.EmptyResponse} EmptyResponse
         */
        EmptyResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.turbotin.EmptyResponse)
                return object;
            var message = new $root.turbotin.EmptyResponse();
            if (object.meta != null) {
                if (typeof object.meta !== "object")
                    throw TypeError(".turbotin.EmptyResponse.meta: object expected");
                message.meta = $root.turbotin.ResponseMeta.fromObject(object.meta);
            }
            return message;
        };

        /**
         * Creates a plain object from an EmptyResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof turbotin.EmptyResponse
         * @static
         * @param {turbotin.EmptyResponse} message EmptyResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        EmptyResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.meta = null;
            if (message.meta != null && message.hasOwnProperty("meta"))
                object.meta = $root.turbotin.ResponseMeta.toObject(message.meta, options);
            return object;
        };

        /**
         * Converts this EmptyResponse to JSON.
         * @function toJSON
         * @memberof turbotin.EmptyResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        EmptyResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for EmptyResponse
         * @function getTypeUrl
         * @memberof turbotin.EmptyResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        EmptyResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/turbotin.EmptyResponse";
        };

        return EmptyResponse;
    })();

    turbotin.EmptyArgs = (function() {

        /**
         * Properties of an EmptyArgs.
         * @memberof turbotin
         * @interface IEmptyArgs
         */

        /**
         * Constructs a new EmptyArgs.
         * @memberof turbotin
         * @classdesc Represents an EmptyArgs.
         * @implements IEmptyArgs
         * @constructor
         * @param {turbotin.IEmptyArgs=} [properties] Properties to set
         */
        function EmptyArgs(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Creates a new EmptyArgs instance using the specified properties.
         * @function create
         * @memberof turbotin.EmptyArgs
         * @static
         * @param {turbotin.IEmptyArgs=} [properties] Properties to set
         * @returns {turbotin.EmptyArgs} EmptyArgs instance
         */
        EmptyArgs.create = function create(properties) {
            return new EmptyArgs(properties);
        };

        /**
         * Encodes the specified EmptyArgs message. Does not implicitly {@link turbotin.EmptyArgs.verify|verify} messages.
         * @function encode
         * @memberof turbotin.EmptyArgs
         * @static
         * @param {turbotin.IEmptyArgs} message EmptyArgs message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EmptyArgs.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            return writer;
        };

        /**
         * Encodes the specified EmptyArgs message, length delimited. Does not implicitly {@link turbotin.EmptyArgs.verify|verify} messages.
         * @function encodeDelimited
         * @memberof turbotin.EmptyArgs
         * @static
         * @param {turbotin.IEmptyArgs} message EmptyArgs message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EmptyArgs.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an EmptyArgs message from the specified reader or buffer.
         * @function decode
         * @memberof turbotin.EmptyArgs
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {turbotin.EmptyArgs} EmptyArgs
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EmptyArgs.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.turbotin.EmptyArgs();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an EmptyArgs message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof turbotin.EmptyArgs
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {turbotin.EmptyArgs} EmptyArgs
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EmptyArgs.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an EmptyArgs message.
         * @function verify
         * @memberof turbotin.EmptyArgs
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        EmptyArgs.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            return null;
        };

        /**
         * Creates an EmptyArgs message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof turbotin.EmptyArgs
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {turbotin.EmptyArgs} EmptyArgs
         */
        EmptyArgs.fromObject = function fromObject(object) {
            if (object instanceof $root.turbotin.EmptyArgs)
                return object;
            return new $root.turbotin.EmptyArgs();
        };

        /**
         * Creates a plain object from an EmptyArgs message. Also converts values to other types if specified.
         * @function toObject
         * @memberof turbotin.EmptyArgs
         * @static
         * @param {turbotin.EmptyArgs} message EmptyArgs
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        EmptyArgs.toObject = function toObject() {
            return {};
        };

        /**
         * Converts this EmptyArgs to JSON.
         * @function toJSON
         * @memberof turbotin.EmptyArgs
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        EmptyArgs.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for EmptyArgs
         * @function getTypeUrl
         * @memberof turbotin.EmptyArgs
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        EmptyArgs.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/turbotin.EmptyArgs";
        };

        return EmptyArgs;
    })();

    turbotin.Auth = (function() {

        /**
         * Constructs a new Auth service.
         * @memberof turbotin
         * @classdesc Represents an Auth
         * @extends $protobuf.rpc.Service
         * @constructor
         * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
         * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
         * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
         */
        function Auth(rpcImpl, requestDelimited, responseDelimited) {
            $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
        }

        (Auth.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = Auth;

        /**
         * Creates new Auth service using the specified rpc implementation.
         * @function create
         * @memberof turbotin.Auth
         * @static
         * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
         * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
         * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
         * @returns {Auth} RPC service. Useful where requests and/or responses are streamed.
         */
        Auth.create = function create(rpcImpl, requestDelimited, responseDelimited) {
            return new this(rpcImpl, requestDelimited, responseDelimited);
        };

        /**
         * Callback as used by {@link turbotin.Auth#getCurrentUser}.
         * @memberof turbotin.Auth
         * @typedef GetCurrentUserCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {turbotin.User} [response] User
         */

        /**
         * Calls GetCurrentUser.
         * @function getCurrentUser
         * @memberof turbotin.Auth
         * @instance
         * @param {turbotin.IEmptyArgs} request EmptyArgs message or plain object
         * @param {turbotin.Auth.GetCurrentUserCallback} callback Node-style callback called with the error, if any, and User
         * @returns {undefined}
         * @variation 1
         */
        Object.defineProperty(Auth.prototype.getCurrentUser = function getCurrentUser(request, callback) {
            return this.rpcCall(getCurrentUser, $root.turbotin.EmptyArgs, $root.turbotin.User, request, callback);
        }, "name", { value: "GetCurrentUser" });

        /**
         * Calls GetCurrentUser.
         * @function getCurrentUser
         * @memberof turbotin.Auth
         * @instance
         * @param {turbotin.IEmptyArgs} request EmptyArgs message or plain object
         * @returns {Promise<turbotin.User>} Promise
         * @variation 2
         */

        /**
         * Callback as used by {@link turbotin.Auth#signUp}.
         * @memberof turbotin.Auth
         * @typedef SignUpCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {turbotin.EmptyResponse} [response] EmptyResponse
         */

        /**
         * Calls SignUp.
         * @function signUp
         * @memberof turbotin.Auth
         * @instance
         * @param {turbotin.IAuthArgs} request AuthArgs message or plain object
         * @param {turbotin.Auth.SignUpCallback} callback Node-style callback called with the error, if any, and EmptyResponse
         * @returns {undefined}
         * @variation 1
         */
        Object.defineProperty(Auth.prototype.signUp = function signUp(request, callback) {
            return this.rpcCall(signUp, $root.turbotin.AuthArgs, $root.turbotin.EmptyResponse, request, callback);
        }, "name", { value: "SignUp" });

        /**
         * Calls SignUp.
         * @function signUp
         * @memberof turbotin.Auth
         * @instance
         * @param {turbotin.IAuthArgs} request AuthArgs message or plain object
         * @returns {Promise<turbotin.EmptyResponse>} Promise
         * @variation 2
         */

        /**
         * Callback as used by {@link turbotin.Auth#login}.
         * @memberof turbotin.Auth
         * @typedef LoginCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {turbotin.EmptyResponse} [response] EmptyResponse
         */

        /**
         * Calls Login.
         * @function login
         * @memberof turbotin.Auth
         * @instance
         * @param {turbotin.IAuthArgs} request AuthArgs message or plain object
         * @param {turbotin.Auth.LoginCallback} callback Node-style callback called with the error, if any, and EmptyResponse
         * @returns {undefined}
         * @variation 1
         */
        Object.defineProperty(Auth.prototype.login = function login(request, callback) {
            return this.rpcCall(login, $root.turbotin.AuthArgs, $root.turbotin.EmptyResponse, request, callback);
        }, "name", { value: "Login" });

        /**
         * Calls Login.
         * @function login
         * @memberof turbotin.Auth
         * @instance
         * @param {turbotin.IAuthArgs} request AuthArgs message or plain object
         * @returns {Promise<turbotin.EmptyResponse>} Promise
         * @variation 2
         */

        /**
         * Callback as used by {@link turbotin.Auth#logout}.
         * @memberof turbotin.Auth
         * @typedef LogoutCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {turbotin.EmptyResponse} [response] EmptyResponse
         */

        /**
         * Calls Logout.
         * @function logout
         * @memberof turbotin.Auth
         * @instance
         * @param {turbotin.IEmptyArgs} request EmptyArgs message or plain object
         * @param {turbotin.Auth.LogoutCallback} callback Node-style callback called with the error, if any, and EmptyResponse
         * @returns {undefined}
         * @variation 1
         */
        Object.defineProperty(Auth.prototype.logout = function logout(request, callback) {
            return this.rpcCall(logout, $root.turbotin.EmptyArgs, $root.turbotin.EmptyResponse, request, callback);
        }, "name", { value: "Logout" });

        /**
         * Calls Logout.
         * @function logout
         * @memberof turbotin.Auth
         * @instance
         * @param {turbotin.IEmptyArgs} request EmptyArgs message or plain object
         * @returns {Promise<turbotin.EmptyResponse>} Promise
         * @variation 2
         */

        return Auth;
    })();

    turbotin.AuthArgs = (function() {

        /**
         * Properties of an AuthArgs.
         * @memberof turbotin
         * @interface IAuthArgs
         * @property {turbotin.IResponseMeta|null} [meta] AuthArgs meta
         * @property {string|null} [email] AuthArgs email
         * @property {string|null} [password] AuthArgs password
         * @property {boolean|null} [rememberMe] AuthArgs rememberMe
         */

        /**
         * Constructs a new AuthArgs.
         * @memberof turbotin
         * @classdesc Represents an AuthArgs.
         * @implements IAuthArgs
         * @constructor
         * @param {turbotin.IAuthArgs=} [properties] Properties to set
         */
        function AuthArgs(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * AuthArgs meta.
         * @member {turbotin.IResponseMeta|null|undefined} meta
         * @memberof turbotin.AuthArgs
         * @instance
         */
        AuthArgs.prototype.meta = null;

        /**
         * AuthArgs email.
         * @member {string} email
         * @memberof turbotin.AuthArgs
         * @instance
         */
        AuthArgs.prototype.email = "";

        /**
         * AuthArgs password.
         * @member {string} password
         * @memberof turbotin.AuthArgs
         * @instance
         */
        AuthArgs.prototype.password = "";

        /**
         * AuthArgs rememberMe.
         * @member {boolean} rememberMe
         * @memberof turbotin.AuthArgs
         * @instance
         */
        AuthArgs.prototype.rememberMe = false;

        /**
         * Creates a new AuthArgs instance using the specified properties.
         * @function create
         * @memberof turbotin.AuthArgs
         * @static
         * @param {turbotin.IAuthArgs=} [properties] Properties to set
         * @returns {turbotin.AuthArgs} AuthArgs instance
         */
        AuthArgs.create = function create(properties) {
            return new AuthArgs(properties);
        };

        /**
         * Encodes the specified AuthArgs message. Does not implicitly {@link turbotin.AuthArgs.verify|verify} messages.
         * @function encode
         * @memberof turbotin.AuthArgs
         * @static
         * @param {turbotin.IAuthArgs} message AuthArgs message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AuthArgs.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.meta != null && Object.hasOwnProperty.call(message, "meta"))
                $root.turbotin.ResponseMeta.encode(message.meta, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.email != null && Object.hasOwnProperty.call(message, "email"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.email);
            if (message.password != null && Object.hasOwnProperty.call(message, "password"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.password);
            if (message.rememberMe != null && Object.hasOwnProperty.call(message, "rememberMe"))
                writer.uint32(/* id 4, wireType 0 =*/32).bool(message.rememberMe);
            return writer;
        };

        /**
         * Encodes the specified AuthArgs message, length delimited. Does not implicitly {@link turbotin.AuthArgs.verify|verify} messages.
         * @function encodeDelimited
         * @memberof turbotin.AuthArgs
         * @static
         * @param {turbotin.IAuthArgs} message AuthArgs message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AuthArgs.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an AuthArgs message from the specified reader or buffer.
         * @function decode
         * @memberof turbotin.AuthArgs
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {turbotin.AuthArgs} AuthArgs
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AuthArgs.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.turbotin.AuthArgs();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.meta = $root.turbotin.ResponseMeta.decode(reader, reader.uint32());
                        break;
                    }
                case 2: {
                        message.email = reader.string();
                        break;
                    }
                case 3: {
                        message.password = reader.string();
                        break;
                    }
                case 4: {
                        message.rememberMe = reader.bool();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an AuthArgs message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof turbotin.AuthArgs
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {turbotin.AuthArgs} AuthArgs
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AuthArgs.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an AuthArgs message.
         * @function verify
         * @memberof turbotin.AuthArgs
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        AuthArgs.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.meta != null && message.hasOwnProperty("meta")) {
                var error = $root.turbotin.ResponseMeta.verify(message.meta);
                if (error)
                    return "meta." + error;
            }
            if (message.email != null && message.hasOwnProperty("email"))
                if (!$util.isString(message.email))
                    return "email: string expected";
            if (message.password != null && message.hasOwnProperty("password"))
                if (!$util.isString(message.password))
                    return "password: string expected";
            if (message.rememberMe != null && message.hasOwnProperty("rememberMe"))
                if (typeof message.rememberMe !== "boolean")
                    return "rememberMe: boolean expected";
            return null;
        };

        /**
         * Creates an AuthArgs message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof turbotin.AuthArgs
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {turbotin.AuthArgs} AuthArgs
         */
        AuthArgs.fromObject = function fromObject(object) {
            if (object instanceof $root.turbotin.AuthArgs)
                return object;
            var message = new $root.turbotin.AuthArgs();
            if (object.meta != null) {
                if (typeof object.meta !== "object")
                    throw TypeError(".turbotin.AuthArgs.meta: object expected");
                message.meta = $root.turbotin.ResponseMeta.fromObject(object.meta);
            }
            if (object.email != null)
                message.email = String(object.email);
            if (object.password != null)
                message.password = String(object.password);
            if (object.rememberMe != null)
                message.rememberMe = Boolean(object.rememberMe);
            return message;
        };

        /**
         * Creates a plain object from an AuthArgs message. Also converts values to other types if specified.
         * @function toObject
         * @memberof turbotin.AuthArgs
         * @static
         * @param {turbotin.AuthArgs} message AuthArgs
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        AuthArgs.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.meta = null;
                object.email = "";
                object.password = "";
                object.rememberMe = false;
            }
            if (message.meta != null && message.hasOwnProperty("meta"))
                object.meta = $root.turbotin.ResponseMeta.toObject(message.meta, options);
            if (message.email != null && message.hasOwnProperty("email"))
                object.email = message.email;
            if (message.password != null && message.hasOwnProperty("password"))
                object.password = message.password;
            if (message.rememberMe != null && message.hasOwnProperty("rememberMe"))
                object.rememberMe = message.rememberMe;
            return object;
        };

        /**
         * Converts this AuthArgs to JSON.
         * @function toJSON
         * @memberof turbotin.AuthArgs
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        AuthArgs.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for AuthArgs
         * @function getTypeUrl
         * @memberof turbotin.AuthArgs
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        AuthArgs.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/turbotin.AuthArgs";
        };

        return AuthArgs;
    })();

    turbotin.User = (function() {

        /**
         * Properties of a User.
         * @memberof turbotin
         * @interface IUser
         * @property {turbotin.IResponseMeta|null} [meta] User meta
         * @property {string|null} [email] User email
         * @property {boolean|null} [emailVerified] User emailVerified
         */

        /**
         * Constructs a new User.
         * @memberof turbotin
         * @classdesc Represents a User.
         * @implements IUser
         * @constructor
         * @param {turbotin.IUser=} [properties] Properties to set
         */
        function User(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * User meta.
         * @member {turbotin.IResponseMeta|null|undefined} meta
         * @memberof turbotin.User
         * @instance
         */
        User.prototype.meta = null;

        /**
         * User email.
         * @member {string} email
         * @memberof turbotin.User
         * @instance
         */
        User.prototype.email = "";

        /**
         * User emailVerified.
         * @member {boolean} emailVerified
         * @memberof turbotin.User
         * @instance
         */
        User.prototype.emailVerified = false;

        /**
         * Creates a new User instance using the specified properties.
         * @function create
         * @memberof turbotin.User
         * @static
         * @param {turbotin.IUser=} [properties] Properties to set
         * @returns {turbotin.User} User instance
         */
        User.create = function create(properties) {
            return new User(properties);
        };

        /**
         * Encodes the specified User message. Does not implicitly {@link turbotin.User.verify|verify} messages.
         * @function encode
         * @memberof turbotin.User
         * @static
         * @param {turbotin.IUser} message User message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        User.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.meta != null && Object.hasOwnProperty.call(message, "meta"))
                $root.turbotin.ResponseMeta.encode(message.meta, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.email != null && Object.hasOwnProperty.call(message, "email"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.email);
            if (message.emailVerified != null && Object.hasOwnProperty.call(message, "emailVerified"))
                writer.uint32(/* id 3, wireType 0 =*/24).bool(message.emailVerified);
            return writer;
        };

        /**
         * Encodes the specified User message, length delimited. Does not implicitly {@link turbotin.User.verify|verify} messages.
         * @function encodeDelimited
         * @memberof turbotin.User
         * @static
         * @param {turbotin.IUser} message User message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        User.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a User message from the specified reader or buffer.
         * @function decode
         * @memberof turbotin.User
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {turbotin.User} User
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        User.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.turbotin.User();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.meta = $root.turbotin.ResponseMeta.decode(reader, reader.uint32());
                        break;
                    }
                case 2: {
                        message.email = reader.string();
                        break;
                    }
                case 3: {
                        message.emailVerified = reader.bool();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a User message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof turbotin.User
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {turbotin.User} User
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        User.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a User message.
         * @function verify
         * @memberof turbotin.User
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        User.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.meta != null && message.hasOwnProperty("meta")) {
                var error = $root.turbotin.ResponseMeta.verify(message.meta);
                if (error)
                    return "meta." + error;
            }
            if (message.email != null && message.hasOwnProperty("email"))
                if (!$util.isString(message.email))
                    return "email: string expected";
            if (message.emailVerified != null && message.hasOwnProperty("emailVerified"))
                if (typeof message.emailVerified !== "boolean")
                    return "emailVerified: boolean expected";
            return null;
        };

        /**
         * Creates a User message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof turbotin.User
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {turbotin.User} User
         */
        User.fromObject = function fromObject(object) {
            if (object instanceof $root.turbotin.User)
                return object;
            var message = new $root.turbotin.User();
            if (object.meta != null) {
                if (typeof object.meta !== "object")
                    throw TypeError(".turbotin.User.meta: object expected");
                message.meta = $root.turbotin.ResponseMeta.fromObject(object.meta);
            }
            if (object.email != null)
                message.email = String(object.email);
            if (object.emailVerified != null)
                message.emailVerified = Boolean(object.emailVerified);
            return message;
        };

        /**
         * Creates a plain object from a User message. Also converts values to other types if specified.
         * @function toObject
         * @memberof turbotin.User
         * @static
         * @param {turbotin.User} message User
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        User.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.meta = null;
                object.email = "";
                object.emailVerified = false;
            }
            if (message.meta != null && message.hasOwnProperty("meta"))
                object.meta = $root.turbotin.ResponseMeta.toObject(message.meta, options);
            if (message.email != null && message.hasOwnProperty("email"))
                object.email = message.email;
            if (message.emailVerified != null && message.hasOwnProperty("emailVerified"))
                object.emailVerified = message.emailVerified;
            return object;
        };

        /**
         * Converts this User to JSON.
         * @function toJSON
         * @memberof turbotin.User
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        User.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for User
         * @function getTypeUrl
         * @memberof turbotin.User
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        User.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/turbotin.User";
        };

        return User;
    })();

    turbotin.Public = (function() {

        /**
         * Constructs a new Public service.
         * @memberof turbotin
         * @classdesc Represents a Public
         * @extends $protobuf.rpc.Service
         * @constructor
         * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
         * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
         * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
         */
        function Public(rpcImpl, requestDelimited, responseDelimited) {
            $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
        }

        (Public.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = Public;

        /**
         * Creates new Public service using the specified rpc implementation.
         * @function create
         * @memberof turbotin.Public
         * @static
         * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
         * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
         * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
         * @returns {Public} RPC service. Useful where requests and/or responses are streamed.
         */
        Public.create = function create(rpcImpl, requestDelimited, responseDelimited) {
            return new this(rpcImpl, requestDelimited, responseDelimited);
        };

        /**
         * Callback as used by {@link turbotin.Public#todaysTobaccos}.
         * @memberof turbotin.Public
         * @typedef TodaysTobaccosCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {turbotin.ObsTobaccoList} [response] ObsTobaccoList
         */

        /**
         * Calls TodaysTobaccos.
         * @function todaysTobaccos
         * @memberof turbotin.Public
         * @instance
         * @param {turbotin.IEmptyArgs} request EmptyArgs message or plain object
         * @param {turbotin.Public.TodaysTobaccosCallback} callback Node-style callback called with the error, if any, and ObsTobaccoList
         * @returns {undefined}
         * @variation 1
         */
        Object.defineProperty(Public.prototype.todaysTobaccos = function todaysTobaccos(request, callback) {
            return this.rpcCall(todaysTobaccos, $root.turbotin.EmptyArgs, $root.turbotin.ObsTobaccoList, request, callback);
        }, "name", { value: "TodaysTobaccos" });

        /**
         * Calls TodaysTobaccos.
         * @function todaysTobaccos
         * @memberof turbotin.Public
         * @instance
         * @param {turbotin.IEmptyArgs} request EmptyArgs message or plain object
         * @returns {Promise<turbotin.ObsTobaccoList>} Promise
         * @variation 2
         */

        return Public;
    })();

    turbotin.ObsTobacco = (function() {

        /**
         * Properties of an ObsTobacco.
         * @memberof turbotin
         * @interface IObsTobacco
         * @property {turbotin.IResponseMeta|null} [meta] ObsTobacco meta
         * @property {string|null} [item] ObsTobacco item
         * @property {turbotin.Store|null} [store] ObsTobacco store
         * @property {string|null} [link] ObsTobacco link
         * @property {string|null} [priceStr] ObsTobacco priceStr
         * @property {google.protobuf.ITimestamp|null} [time] ObsTobacco time
         * @property {boolean|null} [inStock] ObsTobacco inStock
         * @property {number|null} [tobaccoId] ObsTobacco tobaccoId
         */

        /**
         * Constructs a new ObsTobacco.
         * @memberof turbotin
         * @classdesc Represents an ObsTobacco.
         * @implements IObsTobacco
         * @constructor
         * @param {turbotin.IObsTobacco=} [properties] Properties to set
         */
        function ObsTobacco(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ObsTobacco meta.
         * @member {turbotin.IResponseMeta|null|undefined} meta
         * @memberof turbotin.ObsTobacco
         * @instance
         */
        ObsTobacco.prototype.meta = null;

        /**
         * ObsTobacco item.
         * @member {string} item
         * @memberof turbotin.ObsTobacco
         * @instance
         */
        ObsTobacco.prototype.item = "";

        /**
         * ObsTobacco store.
         * @member {turbotin.Store} store
         * @memberof turbotin.ObsTobacco
         * @instance
         */
        ObsTobacco.prototype.store = 0;

        /**
         * ObsTobacco link.
         * @member {string} link
         * @memberof turbotin.ObsTobacco
         * @instance
         */
        ObsTobacco.prototype.link = "";

        /**
         * ObsTobacco priceStr.
         * @member {string} priceStr
         * @memberof turbotin.ObsTobacco
         * @instance
         */
        ObsTobacco.prototype.priceStr = "";

        /**
         * ObsTobacco time.
         * @member {google.protobuf.ITimestamp|null|undefined} time
         * @memberof turbotin.ObsTobacco
         * @instance
         */
        ObsTobacco.prototype.time = null;

        /**
         * ObsTobacco inStock.
         * @member {boolean} inStock
         * @memberof turbotin.ObsTobacco
         * @instance
         */
        ObsTobacco.prototype.inStock = false;

        /**
         * ObsTobacco tobaccoId.
         * @member {number} tobaccoId
         * @memberof turbotin.ObsTobacco
         * @instance
         */
        ObsTobacco.prototype.tobaccoId = 0;

        /**
         * Creates a new ObsTobacco instance using the specified properties.
         * @function create
         * @memberof turbotin.ObsTobacco
         * @static
         * @param {turbotin.IObsTobacco=} [properties] Properties to set
         * @returns {turbotin.ObsTobacco} ObsTobacco instance
         */
        ObsTobacco.create = function create(properties) {
            return new ObsTobacco(properties);
        };

        /**
         * Encodes the specified ObsTobacco message. Does not implicitly {@link turbotin.ObsTobacco.verify|verify} messages.
         * @function encode
         * @memberof turbotin.ObsTobacco
         * @static
         * @param {turbotin.IObsTobacco} message ObsTobacco message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ObsTobacco.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.meta != null && Object.hasOwnProperty.call(message, "meta"))
                $root.turbotin.ResponseMeta.encode(message.meta, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.item != null && Object.hasOwnProperty.call(message, "item"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.item);
            if (message.store != null && Object.hasOwnProperty.call(message, "store"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.store);
            if (message.link != null && Object.hasOwnProperty.call(message, "link"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.link);
            if (message.priceStr != null && Object.hasOwnProperty.call(message, "priceStr"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.priceStr);
            if (message.time != null && Object.hasOwnProperty.call(message, "time"))
                $root.google.protobuf.Timestamp.encode(message.time, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
            if (message.inStock != null && Object.hasOwnProperty.call(message, "inStock"))
                writer.uint32(/* id 8, wireType 0 =*/64).bool(message.inStock);
            if (message.tobaccoId != null && Object.hasOwnProperty.call(message, "tobaccoId"))
                writer.uint32(/* id 10, wireType 0 =*/80).int32(message.tobaccoId);
            return writer;
        };

        /**
         * Encodes the specified ObsTobacco message, length delimited. Does not implicitly {@link turbotin.ObsTobacco.verify|verify} messages.
         * @function encodeDelimited
         * @memberof turbotin.ObsTobacco
         * @static
         * @param {turbotin.IObsTobacco} message ObsTobacco message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ObsTobacco.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an ObsTobacco message from the specified reader or buffer.
         * @function decode
         * @memberof turbotin.ObsTobacco
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {turbotin.ObsTobacco} ObsTobacco
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ObsTobacco.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.turbotin.ObsTobacco();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.meta = $root.turbotin.ResponseMeta.decode(reader, reader.uint32());
                        break;
                    }
                case 2: {
                        message.item = reader.string();
                        break;
                    }
                case 3: {
                        message.store = reader.int32();
                        break;
                    }
                case 4: {
                        message.link = reader.string();
                        break;
                    }
                case 6: {
                        message.priceStr = reader.string();
                        break;
                    }
                case 7: {
                        message.time = $root.google.protobuf.Timestamp.decode(reader, reader.uint32());
                        break;
                    }
                case 8: {
                        message.inStock = reader.bool();
                        break;
                    }
                case 10: {
                        message.tobaccoId = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an ObsTobacco message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof turbotin.ObsTobacco
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {turbotin.ObsTobacco} ObsTobacco
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ObsTobacco.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an ObsTobacco message.
         * @function verify
         * @memberof turbotin.ObsTobacco
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ObsTobacco.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.meta != null && message.hasOwnProperty("meta")) {
                var error = $root.turbotin.ResponseMeta.verify(message.meta);
                if (error)
                    return "meta." + error;
            }
            if (message.item != null && message.hasOwnProperty("item"))
                if (!$util.isString(message.item))
                    return "item: string expected";
            if (message.store != null && message.hasOwnProperty("store"))
                switch (message.store) {
                default:
                    return "store: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                case 9:
                case 10:
                case 11:
                case 12:
                case 13:
                case 14:
                case 15:
                case 16:
                case 17:
                case 18:
                case 19:
                case 20:
                case 21:
                case 22:
                case 23:
                case 24:
                case 25:
                case 26:
                case 27:
                case 28:
                case 29:
                case 30:
                case 31:
                case 32:
                case 33:
                case 34:
                    break;
                }
            if (message.link != null && message.hasOwnProperty("link"))
                if (!$util.isString(message.link))
                    return "link: string expected";
            if (message.priceStr != null && message.hasOwnProperty("priceStr"))
                if (!$util.isString(message.priceStr))
                    return "priceStr: string expected";
            if (message.time != null && message.hasOwnProperty("time")) {
                var error = $root.google.protobuf.Timestamp.verify(message.time);
                if (error)
                    return "time." + error;
            }
            if (message.inStock != null && message.hasOwnProperty("inStock"))
                if (typeof message.inStock !== "boolean")
                    return "inStock: boolean expected";
            if (message.tobaccoId != null && message.hasOwnProperty("tobaccoId"))
                if (!$util.isInteger(message.tobaccoId))
                    return "tobaccoId: integer expected";
            return null;
        };

        /**
         * Creates an ObsTobacco message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof turbotin.ObsTobacco
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {turbotin.ObsTobacco} ObsTobacco
         */
        ObsTobacco.fromObject = function fromObject(object) {
            if (object instanceof $root.turbotin.ObsTobacco)
                return object;
            var message = new $root.turbotin.ObsTobacco();
            if (object.meta != null) {
                if (typeof object.meta !== "object")
                    throw TypeError(".turbotin.ObsTobacco.meta: object expected");
                message.meta = $root.turbotin.ResponseMeta.fromObject(object.meta);
            }
            if (object.item != null)
                message.item = String(object.item);
            switch (object.store) {
            default:
                if (typeof object.store === "number") {
                    message.store = object.store;
                    break;
                }
                break;
            case "s_just4him":
            case 0:
                message.store = 0;
                break;
            case "s_4noggins":
            case 1:
                message.store = 1;
                break;
            case "s_tophat":
            case 2:
                message.store = 2;
                break;
            case "s_cupojoes":
            case 3:
                message.store = 3;
                break;
            case "s_marscigars":
            case 4:
                message.store = 4;
                break;
            case "s_milan":
            case 5:
                message.store = 5;
                break;
            case "s_smokingpipes":
            case 6:
                message.store = 6;
                break;
            case "s_niceashcigars":
            case 7:
                message.store = 7;
                break;
            case "s_iwanries":
            case 8:
                message.store = 8;
                break;
            case "s_mccranies":
            case 9:
                message.store = 9;
                break;
            case "s_boswell":
            case 10:
                message.store = 10;
                break;
            case "s_lilbrown":
            case 11:
                message.store = 11;
                break;
            case "s_windycitycigars":
            case 12:
                message.store = 12;
                break;
            case "s_bnb":
            case 13:
                message.store = 13;
                break;
            case "s_thebriary":
            case 14:
                message.store = 14;
                break;
            case "s_kbven":
            case 15:
                message.store = 15;
                break;
            case "s_tobaccopipes":
            case 16:
                message.store = 16;
                break;
            case "s_kingsmoking":
            case 17:
                message.store = 17;
                break;
            case "s_countrysquire":
            case 18:
                message.store = 18;
                break;
            case "s_pipesandcigars":
            case 19:
                message.store = 19;
                break;
            case "s_watchcitycigar":
            case 20:
                message.store = 20;
                break;
            case "s_thestorytellers":
            case 21:
                message.store = 21;
                break;
            case "s_payless":
            case 22:
                message.store = 22;
                break;
            case "s_hilandscigars":
            case 23:
                message.store = 23;
                break;
            case "s_pipeandleaf":
            case 24:
                message.store = 24;
                break;
            case "s_cigarsintl":
            case 25:
                message.store = 25;
                break;
            case "s_eacarey":
            case 26:
                message.store = 26;
                break;
            case "s_pipenook":
            case 27:
                message.store = 27;
                break;
            case "s_wilke":
            case 28:
                message.store = 28;
                break;
            case "s_smokershaven":
            case 29:
                message.store = 29;
                break;
            case "s_blackcatcigars":
            case 30:
                message.store = 30;
                break;
            case "s_ansteads":
            case 31:
                message.store = 31;
                break;
            case "s_cdmcigars":
            case 32:
                message.store = 32;
                break;
            case "s_ljperetti":
            case 33:
                message.store = 33;
                break;
            case "s_outwest":
            case 34:
                message.store = 34;
                break;
            }
            if (object.link != null)
                message.link = String(object.link);
            if (object.priceStr != null)
                message.priceStr = String(object.priceStr);
            if (object.time != null) {
                if (typeof object.time !== "object")
                    throw TypeError(".turbotin.ObsTobacco.time: object expected");
                message.time = $root.google.protobuf.Timestamp.fromObject(object.time);
            }
            if (object.inStock != null)
                message.inStock = Boolean(object.inStock);
            if (object.tobaccoId != null)
                message.tobaccoId = object.tobaccoId | 0;
            return message;
        };

        /**
         * Creates a plain object from an ObsTobacco message. Also converts values to other types if specified.
         * @function toObject
         * @memberof turbotin.ObsTobacco
         * @static
         * @param {turbotin.ObsTobacco} message ObsTobacco
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ObsTobacco.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.meta = null;
                object.item = "";
                object.store = options.enums === String ? "s_just4him" : 0;
                object.link = "";
                object.priceStr = "";
                object.time = null;
                object.inStock = false;
                object.tobaccoId = 0;
            }
            if (message.meta != null && message.hasOwnProperty("meta"))
                object.meta = $root.turbotin.ResponseMeta.toObject(message.meta, options);
            if (message.item != null && message.hasOwnProperty("item"))
                object.item = message.item;
            if (message.store != null && message.hasOwnProperty("store"))
                object.store = options.enums === String ? $root.turbotin.Store[message.store] === undefined ? message.store : $root.turbotin.Store[message.store] : message.store;
            if (message.link != null && message.hasOwnProperty("link"))
                object.link = message.link;
            if (message.priceStr != null && message.hasOwnProperty("priceStr"))
                object.priceStr = message.priceStr;
            if (message.time != null && message.hasOwnProperty("time"))
                object.time = $root.google.protobuf.Timestamp.toObject(message.time, options);
            if (message.inStock != null && message.hasOwnProperty("inStock"))
                object.inStock = message.inStock;
            if (message.tobaccoId != null && message.hasOwnProperty("tobaccoId"))
                object.tobaccoId = message.tobaccoId;
            return object;
        };

        /**
         * Converts this ObsTobacco to JSON.
         * @function toJSON
         * @memberof turbotin.ObsTobacco
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ObsTobacco.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ObsTobacco
         * @function getTypeUrl
         * @memberof turbotin.ObsTobacco
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ObsTobacco.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/turbotin.ObsTobacco";
        };

        return ObsTobacco;
    })();

    turbotin.ObsTobaccoList = (function() {

        /**
         * Properties of an ObsTobaccoList.
         * @memberof turbotin
         * @interface IObsTobaccoList
         * @property {turbotin.IResponseMeta|null} [meta] ObsTobaccoList meta
         * @property {Array.<turbotin.IObsTobacco>|null} [items] ObsTobaccoList items
         */

        /**
         * Constructs a new ObsTobaccoList.
         * @memberof turbotin
         * @classdesc Represents an ObsTobaccoList.
         * @implements IObsTobaccoList
         * @constructor
         * @param {turbotin.IObsTobaccoList=} [properties] Properties to set
         */
        function ObsTobaccoList(properties) {
            this.items = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ObsTobaccoList meta.
         * @member {turbotin.IResponseMeta|null|undefined} meta
         * @memberof turbotin.ObsTobaccoList
         * @instance
         */
        ObsTobaccoList.prototype.meta = null;

        /**
         * ObsTobaccoList items.
         * @member {Array.<turbotin.IObsTobacco>} items
         * @memberof turbotin.ObsTobaccoList
         * @instance
         */
        ObsTobaccoList.prototype.items = $util.emptyArray;

        /**
         * Creates a new ObsTobaccoList instance using the specified properties.
         * @function create
         * @memberof turbotin.ObsTobaccoList
         * @static
         * @param {turbotin.IObsTobaccoList=} [properties] Properties to set
         * @returns {turbotin.ObsTobaccoList} ObsTobaccoList instance
         */
        ObsTobaccoList.create = function create(properties) {
            return new ObsTobaccoList(properties);
        };

        /**
         * Encodes the specified ObsTobaccoList message. Does not implicitly {@link turbotin.ObsTobaccoList.verify|verify} messages.
         * @function encode
         * @memberof turbotin.ObsTobaccoList
         * @static
         * @param {turbotin.IObsTobaccoList} message ObsTobaccoList message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ObsTobaccoList.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.meta != null && Object.hasOwnProperty.call(message, "meta"))
                $root.turbotin.ResponseMeta.encode(message.meta, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.items != null && message.items.length)
                for (var i = 0; i < message.items.length; ++i)
                    $root.turbotin.ObsTobacco.encode(message.items[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified ObsTobaccoList message, length delimited. Does not implicitly {@link turbotin.ObsTobaccoList.verify|verify} messages.
         * @function encodeDelimited
         * @memberof turbotin.ObsTobaccoList
         * @static
         * @param {turbotin.IObsTobaccoList} message ObsTobaccoList message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ObsTobaccoList.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an ObsTobaccoList message from the specified reader or buffer.
         * @function decode
         * @memberof turbotin.ObsTobaccoList
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {turbotin.ObsTobaccoList} ObsTobaccoList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ObsTobaccoList.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.turbotin.ObsTobaccoList();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.meta = $root.turbotin.ResponseMeta.decode(reader, reader.uint32());
                        break;
                    }
                case 2: {
                        if (!(message.items && message.items.length))
                            message.items = [];
                        message.items.push($root.turbotin.ObsTobacco.decode(reader, reader.uint32()));
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an ObsTobaccoList message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof turbotin.ObsTobaccoList
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {turbotin.ObsTobaccoList} ObsTobaccoList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ObsTobaccoList.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an ObsTobaccoList message.
         * @function verify
         * @memberof turbotin.ObsTobaccoList
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ObsTobaccoList.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.meta != null && message.hasOwnProperty("meta")) {
                var error = $root.turbotin.ResponseMeta.verify(message.meta);
                if (error)
                    return "meta." + error;
            }
            if (message.items != null && message.hasOwnProperty("items")) {
                if (!Array.isArray(message.items))
                    return "items: array expected";
                for (var i = 0; i < message.items.length; ++i) {
                    var error = $root.turbotin.ObsTobacco.verify(message.items[i]);
                    if (error)
                        return "items." + error;
                }
            }
            return null;
        };

        /**
         * Creates an ObsTobaccoList message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof turbotin.ObsTobaccoList
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {turbotin.ObsTobaccoList} ObsTobaccoList
         */
        ObsTobaccoList.fromObject = function fromObject(object) {
            if (object instanceof $root.turbotin.ObsTobaccoList)
                return object;
            var message = new $root.turbotin.ObsTobaccoList();
            if (object.meta != null) {
                if (typeof object.meta !== "object")
                    throw TypeError(".turbotin.ObsTobaccoList.meta: object expected");
                message.meta = $root.turbotin.ResponseMeta.fromObject(object.meta);
            }
            if (object.items) {
                if (!Array.isArray(object.items))
                    throw TypeError(".turbotin.ObsTobaccoList.items: array expected");
                message.items = [];
                for (var i = 0; i < object.items.length; ++i) {
                    if (typeof object.items[i] !== "object")
                        throw TypeError(".turbotin.ObsTobaccoList.items: object expected");
                    message.items[i] = $root.turbotin.ObsTobacco.fromObject(object.items[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from an ObsTobaccoList message. Also converts values to other types if specified.
         * @function toObject
         * @memberof turbotin.ObsTobaccoList
         * @static
         * @param {turbotin.ObsTobaccoList} message ObsTobaccoList
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ObsTobaccoList.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.items = [];
            if (options.defaults)
                object.meta = null;
            if (message.meta != null && message.hasOwnProperty("meta"))
                object.meta = $root.turbotin.ResponseMeta.toObject(message.meta, options);
            if (message.items && message.items.length) {
                object.items = [];
                for (var j = 0; j < message.items.length; ++j)
                    object.items[j] = $root.turbotin.ObsTobacco.toObject(message.items[j], options);
            }
            return object;
        };

        /**
         * Converts this ObsTobaccoList to JSON.
         * @function toJSON
         * @memberof turbotin.ObsTobaccoList
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ObsTobaccoList.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ObsTobaccoList
         * @function getTypeUrl
         * @memberof turbotin.ObsTobaccoList
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ObsTobaccoList.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/turbotin.ObsTobaccoList";
        };

        return ObsTobaccoList;
    })();

    return turbotin;
})();

$root.google = (function() {

    /**
     * Namespace google.
     * @exports google
     * @namespace
     */
    var google = {};

    google.protobuf = (function() {

        /**
         * Namespace protobuf.
         * @memberof google
         * @namespace
         */
        var protobuf = {};

        protobuf.Timestamp = (function() {

            /**
             * Properties of a Timestamp.
             * @memberof google.protobuf
             * @interface ITimestamp
             * @property {number|Long|null} [seconds] Timestamp seconds
             * @property {number|null} [nanos] Timestamp nanos
             */

            /**
             * Constructs a new Timestamp.
             * @memberof google.protobuf
             * @classdesc Represents a Timestamp.
             * @implements ITimestamp
             * @constructor
             * @param {google.protobuf.ITimestamp=} [properties] Properties to set
             */
            function Timestamp(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Timestamp seconds.
             * @member {number|Long} seconds
             * @memberof google.protobuf.Timestamp
             * @instance
             */
            Timestamp.prototype.seconds = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

            /**
             * Timestamp nanos.
             * @member {number} nanos
             * @memberof google.protobuf.Timestamp
             * @instance
             */
            Timestamp.prototype.nanos = 0;

            /**
             * Creates a new Timestamp instance using the specified properties.
             * @function create
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {google.protobuf.ITimestamp=} [properties] Properties to set
             * @returns {google.protobuf.Timestamp} Timestamp instance
             */
            Timestamp.create = function create(properties) {
                return new Timestamp(properties);
            };

            /**
             * Encodes the specified Timestamp message. Does not implicitly {@link google.protobuf.Timestamp.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {google.protobuf.ITimestamp} message Timestamp message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Timestamp.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.seconds != null && Object.hasOwnProperty.call(message, "seconds"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int64(message.seconds);
                if (message.nanos != null && Object.hasOwnProperty.call(message, "nanos"))
                    writer.uint32(/* id 2, wireType 0 =*/16).int32(message.nanos);
                return writer;
            };

            /**
             * Encodes the specified Timestamp message, length delimited. Does not implicitly {@link google.protobuf.Timestamp.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {google.protobuf.ITimestamp} message Timestamp message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Timestamp.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Timestamp message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.Timestamp} Timestamp
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Timestamp.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.Timestamp();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.seconds = reader.int64();
                            break;
                        }
                    case 2: {
                            message.nanos = reader.int32();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a Timestamp message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.Timestamp} Timestamp
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Timestamp.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Timestamp message.
             * @function verify
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Timestamp.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.seconds != null && message.hasOwnProperty("seconds"))
                    if (!$util.isInteger(message.seconds) && !(message.seconds && $util.isInteger(message.seconds.low) && $util.isInteger(message.seconds.high)))
                        return "seconds: integer|Long expected";
                if (message.nanos != null && message.hasOwnProperty("nanos"))
                    if (!$util.isInteger(message.nanos))
                        return "nanos: integer expected";
                return null;
            };

            /**
             * Creates a Timestamp message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.Timestamp} Timestamp
             */
            Timestamp.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.Timestamp)
                    return object;
                var message = new $root.google.protobuf.Timestamp();
                if (object.seconds != null)
                    if ($util.Long)
                        (message.seconds = $util.Long.fromValue(object.seconds)).unsigned = false;
                    else if (typeof object.seconds === "string")
                        message.seconds = parseInt(object.seconds, 10);
                    else if (typeof object.seconds === "number")
                        message.seconds = object.seconds;
                    else if (typeof object.seconds === "object")
                        message.seconds = new $util.LongBits(object.seconds.low >>> 0, object.seconds.high >>> 0).toNumber();
                if (object.nanos != null)
                    message.nanos = object.nanos | 0;
                return message;
            };

            /**
             * Creates a plain object from a Timestamp message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {google.protobuf.Timestamp} message Timestamp
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Timestamp.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, false);
                        object.seconds = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.seconds = options.longs === String ? "0" : 0;
                    object.nanos = 0;
                }
                if (message.seconds != null && message.hasOwnProperty("seconds"))
                    if (typeof message.seconds === "number")
                        object.seconds = options.longs === String ? String(message.seconds) : message.seconds;
                    else
                        object.seconds = options.longs === String ? $util.Long.prototype.toString.call(message.seconds) : options.longs === Number ? new $util.LongBits(message.seconds.low >>> 0, message.seconds.high >>> 0).toNumber() : message.seconds;
                if (message.nanos != null && message.hasOwnProperty("nanos"))
                    object.nanos = message.nanos;
                return object;
            };

            /**
             * Converts this Timestamp to JSON.
             * @function toJSON
             * @memberof google.protobuf.Timestamp
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Timestamp.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for Timestamp
             * @function getTypeUrl
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Timestamp.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/google.protobuf.Timestamp";
            };

            return Timestamp;
        })();

        return protobuf;
    })();

    return google;
})();

module.exports = $root;
