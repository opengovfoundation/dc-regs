#This needs to be run more than once, because it changes folder names and everything gets upset. Just run it until it doesn't spit out errors.

Dir.glob("**/*").each do |filename|	
	File.rename(filename, filename.sub(/ \( Rename History \)/,''))
	File.rename(filename, filename.sub(/\n/,' '))
	File.rename(filename, filename.sub(/\*/,''))
end
