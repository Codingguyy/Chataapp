"use server"
import connectDB from '@/database/db_configure'
import Onetooneconversationodel from '@/models/Onetooneconversation'
import Onetooneconversationsodel from '@/models/conversation'
import OnetooneconversationrequestModel from '@/models/onetooneconversationrequest'
import Groupconversationodel from '@/models/groupconversation'
import Groupconversationsodel from '@/models/groupconversations'
import GrouprequestModel from '@/models/grouprequest'

export default async function Loadallmaps() {
    await connectDB()

    const [
        onetooneconversations,
        onetooneconversationmessages,
        onetooneconversationrequests,
        groupconversations,
        groupconversationmessages,
        grouprequests
    ] = await Promise.all([
        Onetooneconversationodel.find().lean(),
        Onetooneconversationsodel.find().lean(),
        OnetooneconversationrequestModel.find().lean(),
        Groupconversationodel.find().lean(),
        Groupconversationsodel.find().lean(),
        GrouprequestModel.find().lean()
    ])

    return {
        onetooneconversations,
        onetooneconversationmessages,
        onetooneconversationrequests,
        groupconversations,
        groupconversationmessages,
        grouprequests
    }
}
