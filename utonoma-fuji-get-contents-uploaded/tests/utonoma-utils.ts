import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  Approval,
  Transfer,
  deleted,
  disliked,
  harvested,
  liked,
  replied,
  uploaded
} from "../generated/Utonoma/Utonoma"

export function createApprovalEvent(
  owner: Address,
  spender: Address,
  value: BigInt
): Approval {
  let approvalEvent = changetype<Approval>(newMockEvent())

  approvalEvent.parameters = new Array()

  approvalEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("spender", ethereum.Value.fromAddress(spender))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )

  return approvalEvent
}

export function createTransferEvent(
  from: Address,
  to: Address,
  value: BigInt
): Transfer {
  let transferEvent = changetype<Transfer>(newMockEvent())

  transferEvent.parameters = new Array()

  transferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )

  return transferEvent
}

export function createdeletedEvent(
  owner: Address,
  content: Bytes,
  metadata: Bytes,
  index: BigInt,
  contentType: i32
): deleted {
  let deletedEvent = changetype<deleted>(newMockEvent())

  deletedEvent.parameters = new Array()

  deletedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  deletedEvent.parameters.push(
    new ethereum.EventParam("content", ethereum.Value.fromFixedBytes(content))
  )
  deletedEvent.parameters.push(
    new ethereum.EventParam("metadata", ethereum.Value.fromFixedBytes(metadata))
  )
  deletedEvent.parameters.push(
    new ethereum.EventParam("index", ethereum.Value.fromUnsignedBigInt(index))
  )
  deletedEvent.parameters.push(
    new ethereum.EventParam(
      "contentType",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(contentType))
    )
  )

  return deletedEvent
}

export function createdislikedEvent(
  index: BigInt,
  contentType: BigInt
): disliked {
  let dislikedEvent = changetype<disliked>(newMockEvent())

  dislikedEvent.parameters = new Array()

  dislikedEvent.parameters.push(
    new ethereum.EventParam("index", ethereum.Value.fromUnsignedBigInt(index))
  )
  dislikedEvent.parameters.push(
    new ethereum.EventParam(
      "contentType",
      ethereum.Value.fromUnsignedBigInt(contentType)
    )
  )

  return dislikedEvent
}

export function createharvestedEvent(
  index: BigInt,
  contentType: BigInt,
  amount: BigInt
): harvested {
  let harvestedEvent = changetype<harvested>(newMockEvent())

  harvestedEvent.parameters = new Array()

  harvestedEvent.parameters.push(
    new ethereum.EventParam("index", ethereum.Value.fromUnsignedBigInt(index))
  )
  harvestedEvent.parameters.push(
    new ethereum.EventParam(
      "contentType",
      ethereum.Value.fromUnsignedBigInt(contentType)
    )
  )
  harvestedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return harvestedEvent
}

export function createlikedEvent(index: BigInt, contentType: BigInt): liked {
  let likedEvent = changetype<liked>(newMockEvent())

  likedEvent.parameters = new Array()

  likedEvent.parameters.push(
    new ethereum.EventParam("index", ethereum.Value.fromUnsignedBigInt(index))
  )
  likedEvent.parameters.push(
    new ethereum.EventParam(
      "contentType",
      ethereum.Value.fromUnsignedBigInt(contentType)
    )
  )

  return likedEvent
}

export function createrepliedEvent(
  replyIndex: BigInt,
  replyContentType: BigInt,
  replyingToIndex: BigInt,
  replyingToContentType: BigInt
): replied {
  let repliedEvent = changetype<replied>(newMockEvent())

  repliedEvent.parameters = new Array()

  repliedEvent.parameters.push(
    new ethereum.EventParam(
      "replyIndex",
      ethereum.Value.fromUnsignedBigInt(replyIndex)
    )
  )
  repliedEvent.parameters.push(
    new ethereum.EventParam(
      "replyContentType",
      ethereum.Value.fromUnsignedBigInt(replyContentType)
    )
  )
  repliedEvent.parameters.push(
    new ethereum.EventParam(
      "replyingToIndex",
      ethereum.Value.fromUnsignedBigInt(replyingToIndex)
    )
  )
  repliedEvent.parameters.push(
    new ethereum.EventParam(
      "replyingToContentType",
      ethereum.Value.fromUnsignedBigInt(replyingToContentType)
    )
  )

  return repliedEvent
}

export function createuploadedEvent(
  contentCreator: Address,
  index: BigInt,
  contentType: BigInt
): uploaded {
  let uploadedEvent = changetype<uploaded>(newMockEvent())

  uploadedEvent.parameters = new Array()

  uploadedEvent.parameters.push(
    new ethereum.EventParam(
      "contentCreator",
      ethereum.Value.fromAddress(contentCreator)
    )
  )
  uploadedEvent.parameters.push(
    new ethereum.EventParam("index", ethereum.Value.fromUnsignedBigInt(index))
  )
  uploadedEvent.parameters.push(
    new ethereum.EventParam(
      "contentType",
      ethereum.Value.fromUnsignedBigInt(contentType)
    )
  )

  return uploadedEvent
}
