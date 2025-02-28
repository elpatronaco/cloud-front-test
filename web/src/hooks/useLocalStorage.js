import { useEffect, useState } from 'react'

function tryParseJSON(jsonString) {
	try {
		const obj = JSON.parse(jsonString)

		return typeof obj === 'object' ? obj : jsonString
	} catch (e) {
		return jsonString
	}
}

function readFromLocalStorage(key) {
	const item = window.localStorage.getItem(key)

	return item !== null ? tryParseJSON(item) : null
}

function writeToLocalStorage(key, value) {
	window.localStorage.setItem(key, JSON.stringify(value))
}

function removeFromLocalStorage(key) {
	window.localStorage.removeItem(key)
}

export function useLocalStorage(key, initialValue) {
	const [storedValue, setStoredValue] = useState(
		() => readFromLocalStorage(key) || initialValue
	)

	const setValue = (value) => {
		setStoredValue(value)
		writeToLocalStorage(key, value)
	}

	const removeValue = () => {
		setStoredValue(null)
		removeFromLocalStorage(key)
	}

	useEffect(() => {
		const handleStorageChange = (e) => {
			if (e.key === key) {
				setStoredValue(JSON.parse(e.newValue))
			}
		}

		window.addEventListener('storage', handleStorageChange)

		return () => {
			window.removeEventListener('storage', handleStorageChange)
		}
	}, [key])

	return [storedValue, setValue, removeValue]
}
