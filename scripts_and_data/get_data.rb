require 'net/http'
require 'JSON'

restaurants = []

5.times do |i|

  start = i*20
  count = start+20

  url = URI.parse("http://52.36.211.72:5555/gateway/Zomato/1.0/search?start=#{start}&count=#{count}&entity_id=7&entity_type=city")
  puts url
  req = Net::HTTP::Get.new(url)
  req.add_field('x-Gateway-APIKey', 'd3fdc853-0fe6-40e5-9644-85ca141b636f')
  res = Net::HTTP.new(url.host, url.port).start do |http|
    http.request(req)
  end

  response = JSON.parse(res.body)

  restaurants_response = response['restaurants']

  restaurants_response.map do |restaurant_element|

    restaurant = restaurant_element['restaurant']
    puts '******************'
    puts restaurant['id']

    rest_details = {}
    rest_details[:name] = restaurant['name']
    rest_details[:user_rating] = restaurant['user_rating']

    restaurants << {restaurant['id'] => rest_details}

  end
end

restaurants = JSON.parse(File.read('restaurants.json'))


restaurants.map do |restaurant|

# restaurant = restaurants.first
  restaurant['reviews'] = []

  url = URI.parse("http://52.36.211.72:5555/gateway/Zomato/1.0/reviews?res_id=#{restaurant.keys.first}")
  puts url
  req = Net::HTTP::Get.new(url)
  req.add_field('x-Gateway-APIKey', 'd3fdc853-0fe6-40e5-9644-85ca141b636f')
  res = Net::HTTP.new(url.host, url.port).start do |http|
    http.request(req)
  end

  begin
    response = JSON.parse(res.body)
  rescue
    puts '!!Error!!'
    next
  end
  puts response

  review_response = response['user_reviews']

  puts review_response

  review_response.map do |resp_element|
    user_review = resp_element['review']
    review = {}
    review[:rating] = user_review['rating']
    review[:rating_text] = user_review['review_text']
    review[:timestamp] = user_review['timestamp']

    restaurant['reviews'] << review

  end

end
puts restaurants.to_json
