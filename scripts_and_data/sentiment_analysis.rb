require 'net/http'
require 'JSON'
require 'uri'

restaurant_with_reviews = JSON.parse(File.read('restaurants_with_reviews.json'))

restaurant_with_reviews.map do |restaurant|

  # restaurant = restaurant_with_reviews.first
  reviews = restaurant['reviews']

  reviews.map do |review|
    review_text = review['rating_text']

    uri = URI.parse("https://api.meaningcloud.com/sentiment-2.1?key=0e03d07192440b681745db286d37046e&lang=en&of=json&txt=#{URI.encode(review_text).gsub('.', '')}")
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true if uri.scheme == 'https'

    puts uri

    req = Net::HTTP::Post.new uri
    res = http.start {|http| http.request req}

    response = JSON.parse(res.body)

    puts response['score_tag']

    review['sentiment'] = response['score_tag']
  end


end

puts '*****************'
puts restaurant_with_reviews