filenames = Dir.glob("**/*")

filenames.each do |filename|
	File.rename(filename, filename.sub(/ \( Rename History \)/,''))
end
