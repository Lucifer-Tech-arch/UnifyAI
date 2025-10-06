import React from 'react'
import { assets } from '../assets/assets'

function Footer() {
    return (
        <footer className="px-6 pt-8 md:px-16 lg:px-36 w-full text-gray-600">
            <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500 pb-10">
                <div className="md:max-w-96 ">
                    <img alt="" className="h-11 mb-3" src={assets.logo} />
                    <p className="mt-6 mb-5 text-sm">
                        Experience the power of AI with unifyAI. <br />Transform your content creation with our suite premium AI tools. Write articles, generate images, and enhance your workflow
                    </p>
                    <div className="flex items-center gap-2 mt-4">
                        <img src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/refs/heads/main/assets/appDownload/googlePlayBtnBlack.svg" alt="google play" className="h-10 w-auto border border-white rounded" />
                        <img src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/refs/heads/main/assets/appDownload/appleStoreBtnBlack.svg" alt="app store" className="h-10 w-auto border border-white rounded" />
                    </div>
                </div>
                <div className="flex-1 flex items-start md:justify-end gap-20 md:gap-40">
                    <div>
                        <h2 className="font-semibold mb-5 text-gradient">Company</h2>
                        <ul className="text-sm space-y-2">
                            <li><a href="/">Home</a></li>
                            <li><a href="/ai">DashBoard</a></li>
                            <li><a href="#">About us</a></li>
                            <li><a href="#">Privacy policy</a></li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="font-semibold mb-5 text-gradient">Get in touch</h2>
                        <div className="text-sm space-y-2">
                            <p>+91-730483917</p>
                            <p>unifyai@email.com</p>
                        </div>
                    </div>
                </div>
            </div>
            <p className="pt-4 text-center text-sm pb-5">
                Copyright {new Date().getFullYear()} © <a href="https://prebuiltui.com">UnifyAI</a>. All Right Reserved.
            </p>
        </footer>
    )
}

export default Footer
