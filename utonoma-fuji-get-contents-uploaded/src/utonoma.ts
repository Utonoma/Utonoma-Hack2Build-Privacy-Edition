import {
  Approval as ApprovalEvent,
  Transfer as TransferEvent,
  deleted as deletedEvent,
  disliked as dislikedEvent,
  harvested as harvestedEvent,
  liked as likedEvent,
  replied as repliedEvent,
  uploaded as uploadedEvent
} from "../generated/Utonoma/Utonoma"
import {
  Approval,
  Transfer,
  deleted,
  disliked,
  harvested,
  liked,
  replied,
  uploaded
} from "../generated/schema"

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.value = event.params.value

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.value = event.params.value

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handledeleted(event: deletedEvent): void {
  let entity = new deleted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.content = event.params.content
  entity.metadata = event.params.metadata
  entity.index = event.params.index
  entity.contentType = event.params.contentType

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handledisliked(event: dislikedEvent): void {
  let entity = new disliked(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.index = event.params.index
  entity.contentType = event.params.contentType

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleharvested(event: harvestedEvent): void {
  let entity = new harvested(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.index = event.params.index
  entity.contentType = event.params.contentType
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleliked(event: likedEvent): void {
  let entity = new liked(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.index = event.params.index
  entity.contentType = event.params.contentType

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlereplied(event: repliedEvent): void {
  let entity = new replied(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.replyIndex = event.params.replyIndex
  entity.replyContentType = event.params.replyContentType
  entity.replyingToIndex = event.params.replyingToIndex
  entity.replyingToContentType = event.params.replyingToContentType

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleuploaded(event: uploadedEvent): void {
  let entity = new uploaded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.contentCreator = event.params.contentCreator
  entity.index = event.params.index
  entity.contentType = event.params.contentType

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
