export  function m2h(minites) {
	return  Math.floor(minites / 60)
}

export function m2m(minites) {
	return  +minites % 60
}

export function m2t(minites) {
	let h = m2h(minites),
		m = m2m(minites)
	h = (h < 10 ? ('0'+h ) : ''+h)
	m = (m < 10 ? ('0'+m ) : ''+m)

	return `${h}:${m}`
}

export function t2m(h,m){
	return 60*h + m
}