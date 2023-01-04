# Authorization Capabilities
## Using `@spruceid/didkit-wasm-node`

Basic example of how to create, delegate and invoke an authorization capability using DIDKit in node.

## Running the code

Note: I used Node v14.18.1

1. Clone repo
2. Install dependencies: `npm install` (from project folder)
3. Run code: `node index.js`

## Useful information

* [`@spruceid/didkit-wasm-node`](https://www.npmjs.com/package/@spruceid/didkit-wasm-node) is an npm package that provides bindings to functions exposed by the rust library [DIDKit](https://www.spruceid.dev/didkit)
    * The Rust code that this library calls can be found [here](https://github.com/spruceid/didkit/blob/main/lib/web/src/lib.rs#L533)
* Authorization Capabilities are defined in this [W3C Draft Community Report](https://w3c-ccg.github.io/zcap-spec) from the [Credentials Community Group](https://www.w3.org/community/credentials/)
