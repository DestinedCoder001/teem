import CreateChannelDialog from "@/components/custom/CreateChannelDialog"

const CreateNewChannel = () => {
  return (
    <div className="h-full flex flex-col justify-center items-center">
      <div className="text-center space-y-3">
        <p className="text-slate-800 font-[500]">Create a channel</p>
        <CreateChannelDialog />
      </div>
    </div>
  )
}

export default CreateNewChannel