import {
  generateEd25519Key,
  keyToDID,
  keyToVerificationMethod,
  delegateCapability,
  invokeCapability,
  verifyInvocation,
  resolveDID,
  verifyDelegation,
} from '@spruceid/didkit-wasm-node';


const rootCapabilityJWK = generateEd25519Key();

const capControllerDID = keyToDID("key", rootCapabilityJWK);
console.log("Root Cap JWK :", rootCapabilityJWK);
console.log("Root Cap DID :", capControllerDID);

const didDoc = await resolveDID(capControllerDID, "{}");
//   console.log(DIDAuth)did:key:z6Mkn3X6Kdh9AZuV84MJhj9yA6qMT6Sgm1puwFi7N81717dS
console.log("Root Cap DID Doc \n", didDoc);

let rootCapability = {
  "@context": "https://w3id.org/security/v2",
  "id": "urn:zcap:root:https%3A%2F%2Fexample.com%2Ffoo",
  "controller": capControllerDID,
  "invocationTarget": "https://example.com/foo"
};

const capDelegationVM = await keyToVerificationMethod('key', rootCapabilityJWK);
console.log("Cap Delegation Verification Method", capDelegationVM);
console.log("Root Capability : \n", rootCapability);





let capDelegationLinkedDataProofOptions = {
  "verificationMethod": capDelegationVM,
  "proofPurpose": "capabilityDelegation"
};





const delegationJWK = generateEd25519Key();

const delegationDID = keyToDID("key", delegationJWK);
console.log("Delegate to DID : ", delegationDID);

let capabilityToDelegate = {
  // TODO: Not sure why we don't need https://w3id.org/zcap/v1 copnt
  // "@context": [
  //   "https://w3id.org/security/v2",
  //   "https://w3id.org/zcap/v1"
  // ],
  "@context": "https://w3id.org/security/v2",
  "id": "urn:uuid:cdc77118-6bfa-11ec-aceb-10bf48838a41",
  "parentCapability": "urn:zcap:root:https%3A%2F%2Fexample.com%2Ffoo",
  "controller": delegationDID,
  "invocationTarget": "https://example.com/foo",
  "expires": "2023-11-03T18:33:51Z",
  "allowedAction": [
    "write",
    "read"
  ],
};

console.log("Capability to delegate\n", capabilityToDelegate);


const jsonCap = JSON.stringify(capabilityToDelegate);
let result = await delegateCapability(jsonCap, JSON.stringify(capDelegationLinkedDataProofOptions), JSON.stringify([rootCapability.id]), rootCapabilityJWK);
let delegatedCapability = JSON.parse(result);
console.log("Delegated Capability \n", delegatedCapability);


let verificationResult = await verifyDelegation(JSON.stringify(delegatedCapability));
console.log("Delegation Successful ? : ", verificationResult);



//////////////////////////////////////////////////////////////////////////////////////////
// Capability Invocation
//////////////////////////////////////////////////////////////////////////////////////////
console.log("Capability to invoke :\n", delegatedCapability)

const capInvocationVM = await keyToVerificationMethod('key', delegationJWK);
console.log("Cap Invocation Verification Method", capInvocationVM);

let capInvocationLinkedDataProofOptions = {
  "verificationMethod": capInvocationVM,
  "proofPurpose": "capabilityInvocation"
};

const invocation = {
  "@context": "https://w3id.org/security/v2",
  "id": "urn:uuid:ad86cb2c-e9db-434a-beae-71b82120a8a4",
  "capabilityAction": "write",
};

console.log("Unsigned Invocation \n",invocation);

let capInvocation = await invokeCapability(JSON.stringify(invocation), delegatedCapability.id, JSON.stringify(capInvocationLinkedDataProofOptions), delegationJWK);
console.log("Invocation\n", capInvocation);

let invVerificationResult = await verifyInvocation(capInvocation,JSON.stringify(delegatedCapability));
console.log("Invocation Verification", invVerificationResult);

