# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
Item.create([
	{
		name: "Globe",
		legacy_id: "1",
		quantity: 5,
		description: "A round object you can use to view countries of the world!",
		category: "Science"
	},
	{
		name: "Crayon",
		legacy_id: "2",
		quantity: 43,
		description: "A piece of oil on a stick you can color with",
		category: "Art"
	},
	{
		name: "Pencil",
		legacy_id: "3",
		quantity: 56,
		description: "A stick of carbon",
		category: "Art"
	},
	{
		name: "Gold",
		legacy_id: "4",
		quantity: 0,
		description: "Something really valuable that everyone stole",
		category: "Art"
	}
])
