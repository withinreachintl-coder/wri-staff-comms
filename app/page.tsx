export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Staff Communication Tool
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            WhatsApp replacement for restaurant teams
          </p>
          
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-8">
            <p className="text-lg font-semibold text-blue-900 mb-2">
              🚧 Coming Soon
            </p>
            <p className="text-gray-700">
              We're building the best staff communication tool for restaurant teams.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 text-left mb-8">
            <div>
              <div className="text-3xl mb-2">📢</div>
              <h3 className="font-semibold text-gray-900 mb-1">Admin Announcements</h3>
              <p className="text-sm text-gray-600">Broadcast to all staff with read receipts</p>
            </div>
            <div>
              <div className="text-3xl mb-2">🔄</div>
              <h3 className="font-semibold text-gray-900 mb-1">Shift Swaps</h3>
              <p className="text-sm text-gray-600">Staff request, others claim, manager approves</p>
            </div>
            <div>
              <div className="text-3xl mb-2">📱</div>
              <h3 className="font-semibold text-gray-900 mb-1">Mobile First</h3>
              <p className="text-sm text-gray-600">Built for phones in kitchens</p>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            <p>$29/month • 14-day free trial</p>
            <p className="mt-2">Part of the <a href="https://wireach.tools" className="text-blue-600 hover:text-blue-700">WiReach Tools</a> suite</p>
          </div>
        </div>
      </div>
    </div>
  )
}
