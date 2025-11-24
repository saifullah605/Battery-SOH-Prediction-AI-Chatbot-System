import React from 'react'

export default function Sidebar({ children }: { children?: React.ReactNode }) {
	return (
		<aside className="w-64 bg-slate-900/50 backdrop-blur-sm border-r border-slate-700 h-full p-4">
			<div className="text-slate-400 text-sm font-medium mb-4">Sidebar</div>
			<div>{children}</div>
		</aside>
	)
}
