#this takes longer than it should, but it's a quick and dirty way to compensate for the fact that changing directory names makes the iterator cry.
begin
Dir.glob("**/*").each do |filename|	
	File.rename(filename, filename.sub(/ \( Rename History \)/,''))
	File.rename(filename, filename.sub(/\n/,' '))
	File.rename(filename, filename.sub(/\*/,''))
end
rescue
	retry
end

