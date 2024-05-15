
INPUT_FILENAME = "/Users/justjavac/Documents/Elder Scrolls Online/pts/SavedVariables/Librarian.lua"

OUTPUT_PATH = "/Users/justjavac/tmp/aeso-map-js/gamedata/"

FIELD_SEP = ","
LINE_TERMINATOR = "\n"
STRING_QUOTE_CHAR = "\""
OUTPUT_BOOK_FILENAME = OUTPUT_PATH .. "librarian.csv"
PLAYER_NAME = "@justjavac"

BOOK_CSV_FORMAT = {
	"bookId",
	"title",
	"category",
	"medium",
	"body",
}	

function appendCsvRowFormat (filename, itemCsvFormat, rowData)
	local f = io.open(filename, "a+b")
	outputCsvRowFormat(f, itemCsvFormat, rowData)
	f:close()
end


function outputCsvRowFormat (file, itemCsvFormat, rowData)

	for k, v in ipairs(itemCsvFormat) do
		if (k > 1) then file:write(FIELD_SEP) end
		
		local value = nil
		
		if (type(v) == "string") then
			value = rowData[v]
		elseif (type(v) == "table") then
			for k1, v1 in pairs(v) do
				value = rowData[v1]
				if (value ~= nil) then break end
			end
		end
				
		if (value ~= nil and value ~= "") then
			if (type(value) == "string") then file:write(STRING_QUOTE_CHAR) end
			file:write(value)
			if (type(value) == "string") then file:write(STRING_QUOTE_CHAR) end
		end
	end
	
	file:write(LINE_TERMINATOR)
end


function createCsvFile (filename, itemCsvFormat)
	local f = io.open(filename, "wb")
	writeCsvFileHeader(f, itemCsvFormat)
	f:close()
end


function writeCsvFileHeader (f, itemCsvFormat)

	for k, v in ipairs(itemCsvFormat) do
		if (k > 1) then f:write(FIELD_SEP) end
		
		local title = nil
		
		if (type(v) == "string") then
			title = v
		elseif (type(v) == "table") then
			title = v[1]
		end
				
		if (title == nil) then title = tostring(k) end
		f:write(title)
	end
	
	f:write(LINE_TERMINATOR)
end

function escapeString (s)
	s = s:gsub("\"", "'")
	-- s = s:gsub("\226", "-")
	-- s = s:gsub("\128", "")
	-- s = s:gsub("\148", "")
	s = s:gsub("\n", "\\n")
	s = s:gsub("\r", "")
	return s
end


function parseBookData (data)
	for k, book in pairs(data) do
		book.title = escapeString(book.title)
		book.body = escapeString(table.concat(book.body, ""))
		appendCsvRowFormat(OUTPUT_BOOK_FILENAME, BOOK_CSV_FORMAT, book)
	end
end


function main ()
	createCsvFile(OUTPUT_BOOK_FILENAME, BOOK_CSV_FORMAT)

	Librarian_SavedVariables = nil
		
	dofile(INPUT_FILENAME)

	bookData = Librarian_SavedVariables["Default"][PLAYER_NAME]["$AccountWide"]["books"]
	parseBookData(bookData);
end


main()
