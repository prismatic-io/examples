"use client";

export default function Dashboard() {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-zinc-900 rounded-md border border-zinc-800 p-6 shadow-md shadow-black/5">
          <div className="flex justify-between mb-6">
            <div>
              <div className="flex items-center mb-1">
                <div className="text-2xl font-semibold text-zinc-100">2</div>
              </div>
              <div className="text-sm font-medium text-zinc-400">Users</div>
            </div>
            <div className="dropdown">
              <button
                type="button"
                className="dropdown-toggle text-zinc-400 hover:text-zinc-300"
              >
                <i className="ri-more-fill"></i>
              </button>
              <ul className="dropdown-menu shadow-md shadow-black/5 z-30 hidden py-1.5 rounded-md bg-zinc-800 border border-zinc-700 w-full max-w-[140px]">
                <li>
                  <a
                    href="#"
                    className="flex items-center text-[13px] py-1.5 px-4 text-zinc-300 hover:text-blue-400 hover:bg-zinc-700"
                  >
                    Profile
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center text-[13px] py-1.5 px-4 text-zinc-300 hover:text-blue-400 hover:bg-zinc-700"
                  >
                    Settings
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center text-[13px] py-1.5 px-4 text-zinc-300 hover:text-blue-400 hover:bg-zinc-700"
                  >
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <a
            href="/gebruikers"
            className="text-red-400 font-medium text-sm hover:text-red-300"
          >
            View
          </a>
        </div>
        <div className="bg-zinc-900 rounded-md border border-zinc-800 p-6 shadow-md shadow-black/5">
          <div className="flex justify-between mb-4">
            <div>
              <div className="flex items-center mb-1">
                <div className="text-2xl font-semibold text-zinc-100">100</div>
                <div className="p-1 rounded bg-emerald-500/10 text-emerald-500 text-[12px] font-semibold leading-none ml-2">
                  +30%
                </div>
              </div>
              <div className="text-sm font-medium text-zinc-400">Companies</div>
            </div>
            <div className="dropdown">
              <button
                type="button"
                className="dropdown-toggle text-zinc-400 hover:text-zinc-300"
              >
                <i className="ri-more-fill"></i>
              </button>
              <ul className="dropdown-menu shadow-md shadow-black/5 z-30 hidden py-1.5 rounded-md bg-zinc-800 border border-zinc-700 w-full max-w-[140px]">
                <li>
                  <a
                    href="#"
                    className="flex items-center text-[13px] py-1.5 px-4 text-zinc-300 hover:text-blue-400 hover:bg-zinc-700"
                  >
                    Profile
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center text-[13px] py-1.5 px-4 text-zinc-300 hover:text-blue-400 hover:bg-zinc-700"
                  >
                    Settings
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center text-[13px] py-1.5 px-4 text-zinc-300 hover:text-blue-400 hover:bg-zinc-700"
                  >
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <a
            href="/dierenartsen"
            className="text-red-400 font-medium text-sm hover:text-red-300"
          >
            View
          </a>
        </div>
        <div className="bg-zinc-900 rounded-md border border-zinc-800 p-6 shadow-md shadow-black/5">
          <div className="flex justify-between mb-6">
            <div>
              <div className="text-2xl font-semibold mb-1 text-zinc-100">
                100
              </div>
              <div className="text-sm font-medium text-zinc-400">Blogs</div>
            </div>
            <div className="dropdown">
              <button
                type="button"
                className="dropdown-toggle text-zinc-400 hover:text-zinc-300"
              >
                <i className="ri-more-fill"></i>
              </button>
              <ul className="dropdown-menu shadow-md shadow-black/5 z-30 hidden py-1.5 rounded-md bg-zinc-800 border border-zinc-700 w-full max-w-[140px]">
                <li>
                  <a
                    href="#"
                    className="flex items-center text-[13px] py-1.5 px-4 text-zinc-300 hover:text-blue-400 hover:bg-zinc-700"
                  >
                    Profile
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center text-[13px] py-1.5 px-4 text-zinc-300 hover:text-blue-400 hover:bg-zinc-700"
                  >
                    Settings
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center text-[13px] py-1.5 px-4 text-zinc-300 hover:text-blue-400 hover:bg-zinc-700"
                  >
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <a
            href=""
            className="text-red-400 font-medium text-sm hover:text-red-300"
          >
            View
          </a>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="p-6 relative flex flex-col min-w-0 mb-4 lg:mb-0 break-words bg-zinc-800 w-full shadow-lg rounded">
          <div className="rounded-t mb-0 px-0 border-0">
            <div className="flex flex-wrap items-center px-4 py-2">
              <div className="relative w-full max-w-full flex-grow flex-1">
                <h3 className="font-semibold text-base text-zinc-100">Users</h3>
              </div>
            </div>
            <div className="block w-full overflow-x-auto">
              <table className="items-center w-full bg-transparent border-collapse">
                <thead>
                  <tr>
                    <th className="px-4 bg-zinc-700 text-zinc-300 align-middle border border-solid border-zinc-600 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      Role
                    </th>
                    <th className="px-4 bg-zinc-700 text-zinc-300 align-middle border border-solid border-zinc-600 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      Amount
                    </th>
                    <th className="px-4 bg-zinc-700 text-zinc-300 align-middle border border-solid border-zinc-600 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left min-w-140-px"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-zinc-300">
                    <th className="border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                      Administrator
                    </th>
                    <td className="border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      1
                    </td>
                    <td className="border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      <div className="flex items-center">
                        <span className="mr-2">70%</span>
                        <div className="relative w-full">
                          <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-200">
                            <div
                              style={{ width: "70%" }}
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"
                            ></div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr className="text-zinc-300">
                    <th className="border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                      User
                    </th>
                    <td className="border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      6
                    </td>
                    <td className="border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      <div className="flex items-center">
                        <span className="mr-2">40%</span>
                        <div className="relative w-full">
                          <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-200">
                            <div
                              style={{ width: "40%" }}
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                            ></div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr className="text-zinc-300">
                    <th className="border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                      User
                    </th>
                    <td className="border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      5
                    </td>
                    <td className="border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      <div className="flex items-center">
                        <span className="mr-2">45%</span>
                        <div className="relative w-full">
                          <div className="overflow-hidden h-2 text-xs flex rounded bg-pink-200">
                            <div
                              style={{ width: "45%" }}
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-pink-500"
                            ></div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr className="text-zinc-300">
                    <th className="border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                      User
                    </th>
                    <td className="border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      4
                    </td>
                    <td className="border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      <div className="flex items-center">
                        <span className="mr-2">60%</span>
                        <div className="relative w-full">
                          <div className="overflow-hidden h-2 text-xs flex rounded bg-red-200">
                            <div
                              style={{ width: "60%" }}
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"
                            ></div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 shadow-md shadow-black/5 p-6 rounded-md">
          <div className="flex justify-between mb-4 items-start">
            <div className="font-medium text-zinc-100">Activities</div>
            <div className="dropdown">
              <button
                type="button"
                className="dropdown-toggle text-zinc-400 hover:text-zinc-300"
              >
                <i className="ri-more-fill"></i>
              </button>
              <ul className="dropdown-menu shadow-md shadow-black/5 z-30 hidden py-1.5 rounded-md bg-zinc-800 border border-zinc-700 w-full max-w-[140px]">
                <li>
                  <a
                    href="#"
                    className="flex items-center text-[13px] py-1.5 px-4 text-zinc-300 hover:text-blue-400 hover:bg-zinc-700"
                  >
                    Profile
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center text-[13px] py-1.5 px-4 text-zinc-300 hover:text-blue-400 hover:bg-zinc-700"
                  >
                    Settings
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center text-[13px] py-1.5 px-4 text-zinc-300 hover:text-blue-400 hover:bg-zinc-700"
                  >
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="overflow-hidden">
            <table className="w-full min-w-[540px]">
              <tbody>
                <tr>
                  <td className="py-2 px-4 border-b border-b-zinc-700">
                    <div className="flex items-center">
                      <a
                        href="#"
                        className="text-zinc-300 text-sm font-medium hover:text-blue-400 ml-2 truncate"
                      >
                        Lorem Ipsum
                      </a>
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b border-b-zinc-700">
                    <span className="text-[13px] font-medium text-zinc-400">
                      02-02-2024
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-zinc-700">
                    <span className="text-[13px] font-medium text-zinc-400">
                      17.45
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-zinc-700">
                    <div className="dropdown">
                      <button
                        type="button"
                        className="dropdown-toggle text-zinc-400 hover:text-zinc-300 text-sm w-6 h-6 rounded flex items-center justify-center bg-zinc-800"
                      >
                        <i className="ri-more-2-fill"></i>
                      </button>
                      <ul className="dropdown-menu shadow-md shadow-black/5 z-30 hidden py-1.5 rounded-md bg-zinc-800 border border-zinc-700 w-full max-w-[140px]">
                        <li>
                          <a
                            href="#"
                            className="flex items-center text-[13px] py-1.5 px-4 text-zinc-300 hover:text-blue-400 hover:bg-zinc-700"
                          >
                            Profile
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="flex items-center text-[13px] py-1.5 px-4 text-zinc-300 hover:text-blue-400 hover:bg-zinc-700"
                          >
                            Settings
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="flex items-center text-[13px] py-1.5 px-4 text-zinc-300 hover:text-blue-400 hover:bg-zinc-700"
                          >
                            Logout
                          </a>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b border-b-zinc-700">
                    <div className="flex items-center">
                      <a
                        href="#"
                        className="text-zinc-300 text-sm font-medium hover:text-blue-400 ml-2 truncate"
                      >
                        Lorem Ipsum
                      </a>
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b border-b-zinc-700">
                    <span className="text-[13px] font-medium text-zinc-400">
                      02-02-2024
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-zinc-700">
                    <span className="text-[13px] font-medium text-zinc-400">
                      17.45
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-zinc-700">
                    <div className="dropdown">
                      <button
                        type="button"
                        className="dropdown-toggle text-zinc-400 hover:text-zinc-300 text-sm w-6 h-6 rounded flex items-center justify-center bg-zinc-800"
                      >
                        <i className="ri-more-2-fill"></i>
                      </button>
                      <ul className="dropdown-menu shadow-md shadow-black/5 z-30 hidden py-1.5 rounded-md bg-zinc-800 border border-zinc-700 w-full max-w-[140px]">
                        <li>
                          <a
                            href="#"
                            className="flex items-center text-[13px] py-1.5 px-4 text-zinc-300 hover:text-blue-400 hover:bg-zinc-700"
                          >
                            Profile
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="flex items-center text-[13px] py-1.5 px-4 text-zinc-300 hover:text-blue-400 hover:bg-zinc-700"
                          >
                            Settings
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="flex items-center text-[13px] py-1.5 px-4 text-zinc-300 hover:text-blue-400 hover:bg-zinc-700"
                          >
                            Logout
                          </a>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-zinc-900 border border-zinc-800 shadow-md shadow-black/5 p-6 rounded-md lg:col-span-2">
          <div className="flex justify-between mb-4 items-start">
            <div className="font-medium text-zinc-100">Order Statistics</div>
            <div className="dropdown">
              <button
                type="button"
                className="dropdown-toggle text-zinc-400 hover:text-zinc-300"
              >
                <i className="ri-more-fill"></i>
              </button>
              <ul className="dropdown-menu shadow-md shadow-black/5 z-30 hidden py-1.5 rounded-md bg-zinc-800 border border-zinc-700 w-full max-w-[140px]">
                <li>
                  <a
                    href="#"
                    className="flex items-center text-[13px] py-1.5 px-4 text-zinc-300 hover:text-blue-400 hover:bg-zinc-700"
                  >
                    Profile
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center text-[13px] py-1.5 px-4 text-zinc-300 hover:text-blue-400 hover:bg-zinc-700"
                  >
                    Settings
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center text-[13px] py-1.5 px-4 text-zinc-300 hover:text-blue-400 hover:bg-zinc-700"
                  >
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div className="rounded-md border border-dashed border-zinc-700 p-4">
              <div className="flex items-center mb-0.5">
                <div className="text-xl font-semibold text-zinc-100">10</div>
                <span className="p-1 rounded text-[12px] font-semibold bg-blue-500/10 text-blue-500 leading-none ml-1">
                  $80
                </span>
              </div>
              <span className="text-zinc-400 text-sm">Active</span>
            </div>
            <div className="rounded-md border border-dashed border-zinc-700 p-4">
              <div className="flex items-center mb-0.5">
                <div className="text-xl font-semibold text-zinc-100">50</div>
                <span className="p-1 rounded text-[12px] font-semibold bg-emerald-500/10 text-emerald-500 leading-none ml-1">
                  +$469
                </span>
              </div>
              <span className="text-zinc-400 text-sm">Completed</span>
            </div>
            <div className="rounded-md border border-dashed border-zinc-700 p-4">
              <div className="flex items-center mb-0.5">
                <div className="text-xl font-semibold text-zinc-100">4</div>
                <span className="p-1 rounded text-[12px] font-semibold bg-rose-500/10 text-rose-500 leading-none ml-1">
                  -$130
                </span>
              </div>
              <span className="text-zinc-400 text-sm">Canceled</span>
            </div>
          </div>
          <div>
            <canvas id="order-chart"></canvas>
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 shadow-md shadow-black/5 p-6 rounded-md">
          <div className="flex justify-between mb-4 items-start">
            <div className="font-medium text-zinc-100">Earnings</div>
            <div className="dropdown">
              <button
                type="button"
                className="dropdown-toggle text-zinc-400 hover:text-zinc-300"
              >
                <i className="ri-more-fill"></i>
              </button>
              <ul className="dropdown-menu shadow-md shadow-black/5 z-30 hidden py-1.5 rounded-md bg-zinc-800 border border-zinc-700 w-full max-w-[140px]">
                <li>
                  <a
                    href="#"
                    className="flex items-center text-[13px] py-1.5 px-4 text-zinc-300 hover:text-blue-400 hover:bg-zinc-700"
                  >
                    Profile
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center text-[13px] py-1.5 px-4 text-zinc-300 hover:text-blue-400 hover:bg-zinc-700"
                  >
                    Settings
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center text-[13px] py-1.5 px-4 text-zinc-300 hover:text-blue-400 hover:bg-zinc-700"
                  >
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[460px]">
              <thead>
                <tr>
                  <th className="text-[12px] uppercase tracking-wide font-medium text-zinc-400 py-2 px-4 bg-zinc-800 text-left rounded-tl-md rounded-bl-md">
                    Service
                  </th>
                  <th className="text-[12px] uppercase tracking-wide font-medium text-zinc-400 py-2 px-4 bg-zinc-800 text-left">
                    Earning
                  </th>
                  <th className="text-[12px] uppercase tracking-wide font-medium text-zinc-400 py-2 px-4 bg-zinc-800 text-left rounded-tr-md rounded-br-md">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 px-4 border-b border-b-zinc-700">
                    <div className="flex items-center">
                      <img
                        src="https://placehold.co/32x32"
                        alt=""
                        className="w-8 h-8 rounded object-cover block"
                      />
                      <a
                        href="#"
                        className="text-zinc-300 text-sm font-medium hover:text-blue-400 ml-2 truncate"
                      >
                        Create landing page
                      </a>
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b border-b-zinc-700">
                    <span className="text-[13px] font-medium text-emerald-500">
                      +$235
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-zinc-700">
                    <span className="inline-block p-1 rounded bg-emerald-500/10 text-emerald-500 font-medium text-[12px] leading-none">
                      Pending
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b border-b-zinc-700">
                    <div className="flex items-center">
                      <img
                        src="https://placehold.co/32x32"
                        alt=""
                        className="w-8 h-8 rounded object-cover block"
                      />
                      <a
                        href="#"
                        className="text-zinc-300 text-sm font-medium hover:text-blue-400 ml-2 truncate"
                      >
                        Create landing page
                      </a>
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b border-b-zinc-700">
                    <span className="text-[13px] font-medium text-rose-500">
                      -$235
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-zinc-700">
                    <span className="inline-block p-1 rounded bg-rose-500/10 text-rose-500 font-medium text-[12px] leading-none">
                      Withdrawn
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b border-b-zinc-700">
                    <div className="flex items-center">
                      <img
                        src="https://placehold.co/32x32"
                        alt=""
                        className="w-8 h-8 rounded object-cover block"
                      />
                      <a
                        href="#"
                        className="text-zinc-300 text-sm font-medium hover:text-blue-400 ml-2 truncate"
                      >
                        Create landing page
                      </a>
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b border-b-zinc-700">
                    <span className="text-[13px] font-medium text-emerald-500">
                      +$235
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-zinc-700">
                    <span className="inline-block p-1 rounded bg-emerald-500/10 text-emerald-500 font-medium text-[12px] leading-none">
                      Pending
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b border-b-zinc-700">
                    <div className="flex items-center">
                      <img
                        src="https://placehold.co/32x32"
                        alt=""
                        className="w-8 h-8 rounded object-cover block"
                      />
                      <a
                        href="#"
                        className="text-zinc-300 text-sm font-medium hover:text-blue-400 ml-2 truncate"
                      >
                        Create landing page
                      </a>
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b border-b-zinc-700">
                    <span className="text-[13px] font-medium text-rose-500">
                      -$235
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-zinc-700">
                    <span className="inline-block p-1 rounded bg-rose-500/10 text-rose-500 font-medium text-[12px] leading-none">
                      Withdrawn
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b border-b-zinc-700">
                    <div className="flex items-center">
                      <img
                        src="https://placehold.co/32x32"
                        alt=""
                        className="w-8 h-8 rounded object-cover block"
                      />
                      <a
                        href="#"
                        className="text-zinc-300 text-sm font-medium hover:text-blue-400 ml-2 truncate"
                      >
                        Create landing page
                      </a>
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b border-b-zinc-700">
                    <span className="text-[13px] font-medium text-emerald-500">
                      +$235
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-zinc-700">
                    <span className="inline-block p-1 rounded bg-emerald-500/10 text-emerald-500 font-medium text-[12px] leading-none">
                      Pending
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b border-b-zinc-700">
                    <div className="flex items-center">
                      <img
                        src="https://placehold.co/32x32"
                        alt=""
                        className="w-8 h-8 rounded object-cover block"
                      />
                      <a
                        href="#"
                        className="text-zinc-300 text-sm font-medium hover:text-blue-400 ml-2 truncate"
                      >
                        Create landing page
                      </a>
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b border-b-zinc-700">
                    <span className="text-[13px] font-medium text-rose-500">
                      -$235
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-zinc-700">
                    <span className="inline-block p-1 rounded bg-rose-500/10 text-rose-500 font-medium text-[12px] leading-none">
                      Withdrawn
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b border-b-zinc-700">
                    <div className="flex items-center">
                      <img
                        src="https://placehold.co/32x32"
                        alt=""
                        className="w-8 h-8 rounded object-cover block"
                      />
                      <a
                        href="#"
                        className="text-zinc-300 text-sm font-medium hover:text-blue-400 ml-2 truncate"
                      >
                        Create landing page
                      </a>
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b border-b-zinc-700">
                    <span className="text-[13px] font-medium text-emerald-500">
                      +$235
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-zinc-700">
                    <span className="inline-block p-1 rounded bg-emerald-500/10 text-emerald-500 font-medium text-[12px] leading-none">
                      Pending
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
